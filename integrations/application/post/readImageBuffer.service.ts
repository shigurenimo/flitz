import { captureException } from "@sentry/node"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import {
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

      await this.storageAdapter.downloadFileFromCloudStorage(filePath)

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
