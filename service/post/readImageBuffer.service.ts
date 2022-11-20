import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core"
import { FileRepository, ImageAdapter, StorageAdapter } from "infrastructure"
import { InternalError } from "infrastructure/errors"

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
      return new InternalError()
    }
  }
}
