import { z } from "zod"
import { FileType, Id, Path, Service } from "integrations/domain/valueObjects"

const zProps = z.object({
  id: z.instanceof(Id),
  path: z.instanceof(Path),
  type: z.instanceof(FileType),
  service: z.instanceof(Service).nullable(),
  userId: z.instanceof(Id),
})

/**
 * 画像ファイル
 */
export class FileEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * アップロードしたパス
   */
  readonly path!: Path

  /**
   * 画像の形式
   *
   * - IMAGE_PNG
   */
  readonly type!: FileType

  /**
   * アップロード先のサービス
   *
   * - ローカル
   * - CloudStorage
   */
  readonly service!: Service | null

  /**
   * アップロードしたユーザーのID
   */
  readonly userId!: Id

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
