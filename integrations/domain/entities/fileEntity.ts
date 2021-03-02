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
  id!: Id

  /**
   * アップロードしたパス
   */
  path!: Path

  /**
   * 画像の形式
   *
   * - IMAGE_PNG
   */
  type!: FileType

  /**
   * アップロード先のサービス
   *
   * - ローカル
   * - CloudStorage
   */
  service!: Service | null

  /**
   * アップロードしたユーザーのID
   */
  userId!: Id

  constructor(public props: Omit<FileEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
