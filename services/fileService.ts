import { FileType, Id, Image, Service } from "domain/valueObjects"
import {
  EnvRepository,
  FileRepository,
  ImageRepository,
  StorageRepository,
} from "infrastructure"

export class FileService {
  static async uploadFile(input: { userId: Id; image: Image | null }) {
    if (input.image === null) {
      return null
    }

    const filePath = StorageRepository.createPath()

    await ImageRepository.writeImage(input.image, filePath)

    if (EnvRepository.isFirebaseProject()) {
      await StorageRepository.uploadToCloudStorage(filePath)

      return FileRepository.createFile({
        userId: input.userId,
        fileType: new FileType("IMAGE_PNG"),
        service: new Service("CLOUD_STORAGE"),
        path: filePath,
      })
    }

    return FileRepository.createFile({
      userId: input.userId,
      fileType: new FileType("IMAGE_PNG"),
      service: null,
      path: filePath,
    })
  }
}
