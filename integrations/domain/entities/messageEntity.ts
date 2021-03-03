import type { Id, PostText } from "integrations/domain/valueObjects"

/**
 * DM
 */
export class MessageEntity {
  /**
   * ID
   */
  id!: Id

  /**
   * 作成日
   */
  createdAt!: Date

  /**
   * メッセージを確認したかどうか
   */
  isRead!: boolean

  /**
   * メッセージ
   */
  text!: PostText

  /**
   * メッセージを送信したユーザーのID
   */
  userId!: Id

  /**
   * メッセージを受け取ったユーザーのID
   */
  relatedUserId!: Id

  constructor(public props: Omit<MessageEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
