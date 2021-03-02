import type { Id } from "integrations/domain/valueObjects"

/**
 * ブックマーク
 */
export class BookmarkEntity {
  /**
   * ID
   */
  id!: Id

  /**
   * 作成日
   */
  createdAt!: Date

  /**
   * ブックマークした投稿のID
   */
  postId!: Id

  /**
   * ブックマークしたユーザーのID
   */
  userId!: Id

  constructor(public props: Omit<BookmarkEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
