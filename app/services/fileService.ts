import { File } from "db"
import { FileEntity, FileType, Id, Image, Service } from "integrations/domain"
import {
  EnvRepository,
  FileRepository,
  ImageRepository,
  StorageRepository,
} from "integrations/infrastructure"

export class FileService {
  async uploadFile(input: {
    userId: Id
    image: Image | null
  }): Promise<{
    file: File | null
    fileEntity: FileEntity | null
  }> {
    if (input.image === null) {
      return { file: null, fileEntity: null }
    }

    const storageRepository = new StorageRepository()

    const filePath = storageRepository.createPath()

    const imageRepository = new ImageRepository()

    await imageRepository.writeImage(input.image, filePath)

    const envRepository = new EnvRepository()

    const fileRepository = new FileRepository()

    if (envRepository.isFirebaseProject()) {
      await storageRepository.uploadToCloudStorage(filePath)

      return fileRepository.createFile({
        userId: input.userId,
        fileType: new FileType("IMAGE_PNG"),
        service: new Service("CLOUD_STORAGE"),
        path: filePath,
      })
    }

    return fileRepository.createFile({
      userId: input.userId,
      fileType: new FileType("IMAGE_PNG"),
      service: null,
      path: filePath,
    })
  }
}
