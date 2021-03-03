import { Injectable } from "@nestjs/common"
import { FileRepository, Id } from "integrations/domain"
import {
  EnvAdapterService,
  ImageAdapterService,
  StorageAdapterService,
} from "integrations/infrastructure"

@Injectable()
export class ReadImageBufferService {
  constructor(
    private envAdapter: EnvAdapterService,
    private fileRepository: FileRepository,
    private imageAdapter: ImageAdapterService,
    private storageAdapter: StorageAdapterService
  ) {}

  async call(input: { fileId: Id }) {
    const fileEntity = await this.fileRepository.find(input.fileId)

    if (fileEntity === null) {
      return new Error("画像が存在しません。")
    }

    const filePath = fileEntity.path

    if (this.envAdapter.isLocalProject()) {
      const hasImage = this.imageAdapter.hasImage(filePath)

      if (!hasImage) {
        return new Error("ローカルに画像が存在しません。")
      }
    }

    if (this.envAdapter.isFirebaseProject()) {
      await this.storageAdapter.downloadFileFromCloudStorage(filePath)
    }

    const buffer = await this.imageAdapter.readImage(filePath)

    return buffer
  }
}
