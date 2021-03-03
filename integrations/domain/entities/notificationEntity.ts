import type { Id, NotificationType } from "integrations/domain/valueObjects"

/**
 * 通知
 */
export class NotificationEntity {
  /**
   * ID
   */
  id!: Id

  /**
   * フォロー関係のID
   */
  friendshipId!: Id | null

  /**
   * 通知を確認したかどうか
   */
  isRead!: boolean

  /**
   * イイネのID
   */
  likeId!: Id | null

  /**
   * 投稿のID
   */
  postId!: Id | null

  /**
   * 通知の種類
   */
  type!: NotificationType

  /**
   * 通知を受け取るユーザーのID
   */
  userId!: Id

  /**
   * 通知を発生させたユーザーのID
   */
  relatedUserId!: Id | null

  constructor(public props: Omit<NotificationEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
