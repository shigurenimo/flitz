import type { Id, NotificationType } from "integrations/domain/valueObjects"

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

  constructor(public props: Omit<NotificationEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
