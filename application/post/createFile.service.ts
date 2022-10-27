import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { FileEntity, FileTypeFactory, Id, Path, Service } from "core"
import { FileRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
  fileId: Id
}

@injectable()
export class CreateFileService {
  constructor(private fileRepository: FileRepository) {}

  /**
   * 新しいファイルを作成する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const draftFile = new FileEntity({
        id: props.fileId,
        userId: props.userId,
        type: FileTypeFactory.png(),
        service: new Service("CLOUD_STORAGE"),
        path: new Path(props.fileId.value),
      })

      const transaction = await this.fileRepository.upsert(draftFile)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return null
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
