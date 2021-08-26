import type { Count, Id, PostText } from "integrations/domain/valueObjects"

/**
 * 投稿
 */
export class PostEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 引用のID
   */
  readonly quotationId!: Id | null

  /**
   * 引用された回数
   */
  readonly quotationsCount!: Count

  /**
   * 返信された回数
   */
  readonly repliesCount!: Count

  /**
   * 返信先のID
   */
  readonly replyId!: Id | null

  /**
   * 文章
   */
  readonly text!: PostText | null

  /**
   * 作成したユーザーのID
   */
  readonly userId!: Id

  /**
   * 関連付けされたファイルのID
   */
  readonly fileIds!: Id[]

  /**
   * 関連するフィード
   *
   * referencesに変更する
   *
   * @deprecated
   */
  readonly followerIds!: Id[]

  constructor(public props: Omit<PostEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
