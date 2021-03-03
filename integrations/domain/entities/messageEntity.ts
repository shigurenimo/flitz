import type { Id, PostText } from "integrations/domain/valueObjects"

/**
 * DM
 */
export class MessageEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 作成日
   */
  readonly createdAt!: Date

  /**
   * メッセージを確認したかどうか
   */
  readonly isRead!: boolean

  /**
   * メッセージ
   */
  readonly text!: PostText

  /**
   * メッセージを送信したユーザーのID
   */
  readonly userId!: Id

  /**
   * メッセージを受け取ったユーザーのID
   */
  readonly relatedUserId!: Id

  constructor(public props: Omit<MessageEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
