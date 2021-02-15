import { File } from "db"
import { FileEntity, FileType, Id, Image, Service } from "integrations/domain"
import {
  EnvRepository,
  FileRepository,
  ImageRepository,
  StorageRepository,
} from "integrations/infrastructure"

export class UploadFileService {
  constructor(
    private envRepository: EnvRepository,
    private fileRepository: FileRepository,
    private imageRepository: ImageRepository,
    private storageRepository: StorageRepository
  ) {}

  async execute(input: {
    userId: Id
    image: Image | null
  }): Promise<{
    file: File | null
    fileEntity: FileEntity | null
  }> {
    if (input.image === null) {
      return { file: null, fileEntity: null }
    }

    const filePath = this.storageRepository.createPath()

    await this.imageRepository.writeImage(input.image, filePath)

    if (this.envRepository.isFirebaseProject()) {
      await this.storageRepository.uploadToCloudStorage(filePath)

      return this.fileRepository.createFile({
        userId: input.userId,
        fileType: new FileType("IMAGE_PNG"),
        service: new Service("CLOUD_STORAGE"),
        path: filePath,
      })
    }

    return this.fileRepository.createFile({
      userId: input.userId,
      fileType: new FileType("IMAGE_PNG"),
      service: null,
      path: filePath,
    })
  }
}
