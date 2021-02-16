import type { Id } from "integrations/domain/valueObjects"

/**
 * 通知
 */
export interface INotificationRepository {
  /**
   * TODO: 集約
   * @param input
   */
  upsertQuotationNotification(input: {
    quotationId: Id
    postUserId: Id
    postId: Id
  }): Promise<null>

  /**
   * TODO: 集約
   * @param input
   */
  upsertPostLikeNotification(input: {
    likeId: Id
    postId: Id
    postUserId: Id
    userId: Id
  }): Promise<null>

  /**
   * TODO: 集約
   * @param input
   */
  upsertFollowNotification(input: {
    followeeId: Id
    followerId: Id
    friendshipId: Id
  }): Promise<null>

  /**
   * TODO: 集約
   * @param input
   */
  createReplyNotification(input: { replyId: Id; postUserId: Id }): Promise<null>

  markAsRead(input: { userId: Id }): Promise<null>
}
