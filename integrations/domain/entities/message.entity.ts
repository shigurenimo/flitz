import { Id, PostText } from "integrations/domain/valueObjects"
import { z } from "zod"

const zProps = z.object({
  id: z.instanceof(Id),
  createdAt: z.instanceof(Date),
  isRead: z.boolean(),
  text: z.instanceof(PostText),
  userId: z.instanceof(Id),
  relatedUserId: z.instanceof(Id),
})

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

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
