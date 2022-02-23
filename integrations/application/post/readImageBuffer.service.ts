import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
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

      if (file instanceof Error) {
        return new InternalError()
      }

      if (file === null) {
        return new NotFoundError("画像が存在しません。")
      }

      const downloadFile = await this.storageAdapter.downloadFile(file.path)

      if (downloadFile instanceof Error) {
        return new InternalError()
      }

      const buffer = await this.imageAdapter.readImage(file.path)

      if (buffer instanceof Error) {
        return new InternalError()
      }

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
