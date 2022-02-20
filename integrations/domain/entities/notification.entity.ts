import { Id, NotificationType } from "integrations/domain/valueObjects"
import { z } from "zod"

const zProps = z.object({
  id: z.instanceof(Id),
  friendshipId: z.instanceof(Id).nullable(),
  isRead: z.boolean(),
  likeId: z.instanceof(Id).nullable(),
  postId: z.instanceof(Id).nullable(),
  type: z.instanceof(NotificationType),
  userId: z.instanceof(Id),
  relatedUserId: z.instanceof(Id).nullable(),
})

/**
 * 通知
 */
export class NotificationEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * フォロー関係のID
   */
  readonly friendshipId!: Id | null

  /**
   * 通知を確認したかどうか
   */
  readonly isRead!: boolean

  /**
   * イイネのID
   */
  readonly likeId!: Id | null

  /**
   * 投稿のID
   */
  readonly postId!: Id | null

  /**
   * 通知の種類
   */
  readonly type!: NotificationType

  /**
   * 通知を受け取るユーザーのID
   */
  readonly userId!: Id

  /**
   * 通知を発生させたユーザーのID
   */
  readonly relatedUserId!: Id | null

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
