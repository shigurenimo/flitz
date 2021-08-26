import type { Id } from "integrations/domain/valueObjects"

/**
 * ブックマーク
 */
export class BookmarkEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 作成日
   */
  readonly createdAt!: Date

  /**
   * ブックマークした投稿のID
   */
  readonly postId!: Id

  /**
   * ブックマークしたユーザーのID
   */
  readonly userId!: Id

  constructor(
    public props: {
      createdAt: Date
      id: ImageData
      postId: Id
      userId: Id
    }
  ) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
