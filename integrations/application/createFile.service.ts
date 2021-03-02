import { Injectable } from "@nestjs/common"
import {
  FileEntity,
  FileRepository,
  FileType,
  Id,
  IdFactory,
  Image,
  Service,
} from "integrations/domain"
import {
  EnvAdapterService,
  ImageAdapterService,
  StorageAdapterService,
} from "integrations/infrastructure"

@Injectable()
export class CreateFileService {
  constructor(
    private envRepository: EnvAdapterService,
    private fileRepository: FileRepository,
    private imageRepository: ImageAdapterService,
    private storageRepository: StorageAdapterService
  ) {}

  async call(input: { userId: Id; image: Image | null }) {
    if (input.image === null) {
      return null
    }

    const filePath = this.storageRepository.createPath()

    await this.imageRepository.writeImage(input.image, filePath)

    if (this.envRepository.isFirebaseProject()) {
      await this.storageRepository.uploadToCloudStorage(filePath)

      const fileEntity = new FileEntity({
        id: IdFactory.create(),
        userId: input.userId,
        type: new FileType("IMAGE_PNG"),
        service: new Service("CLOUD_STORAGE"),
        path: filePath,
      })

      await this.fileRepository.upsert(fileEntity)

      return fileEntity
    }

    const fileEntity = new FileEntity({
      id: IdFactory.create(),
      userId: input.userId,
      type: new FileType("IMAGE_PNG"),
      service: null,
      path: filePath,
    })

    await this.fileRepository.upsert(fileEntity)

    return fileEntity
  }
}
