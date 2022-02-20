import { captureException } from "@sentry/node"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import {
  EnvAdapter,
  FileRepository,
  ImageAdapter,
  StorageAdapter,
} from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  fileId: Id
}

@injectable()
export class ReadImageBufferService {
  constructor(
    private envAdapter: EnvAdapter,
    private fileRepository: FileRepository,
    private imageAdapter: ImageAdapter,
    private storageAdapter: StorageAdapter
  ) {}

  async execute(props: Props) {
    try {
      const file = await this.fileRepository.find(props.fileId)

      if (file === null) {
        return new Error("画像が存在しません。")
      }

      const filePath = file.path

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
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
