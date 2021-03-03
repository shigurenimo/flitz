import type {
  FileType,
  Id,
  Path,
  Service,
} from "integrations/domain/valueObjects"

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

  constructor(public props: Omit<FileEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
