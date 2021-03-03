import type { Id } from "integrations/domain/valueObjects"

/**
 * 投稿に対するイイネ
 */
export class LikeEntity {
  /**
   * ID
   */
  id!: Id

  /**
   * 投稿のID
   */
  postId!: Id

  /**
   * いいねしたユーザーのID
   */
  userId!: Id

  constructor(public props: Omit<LikeEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
