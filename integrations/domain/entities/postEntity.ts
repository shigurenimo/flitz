import type { Count, Id, PostText } from "integrations/domain/valueObjects"

/**
 * 投稿
 */
export class PostEntity {
  /**
   * ID
   */
  id!: Id

  /**
   * 引用のID
   */
  quotationId!: Id | null

  /**
   * 引用された回数
   */
  quotationsCount!: Count

  /**
   * 返信された回数
   */
  repliesCount!: Count

  /**
   * 返信先のID
   */
  replyId!: Id | null

  /**
   * 文章
   */
  text!: PostText | null

  /**
   * 作成したユーザーのID
   */
  userId!: Id

  /**
   * 関連付けされたファイルのID
   */
  fileIds!: Id[]

  /**
   * 関連するフィード
   *
   * referencesに変更する
   *
   * @deprecated
   */
  followerIds!: Id[]

  constructor(public props: Omit<PostEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
