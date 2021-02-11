import { Friendship, Like, Notification, Post } from "db"
import { NotificationEntity } from "integrations/domain/entities"
import { EmbededPost, UserWithIcon } from "integrations/domain/repositories/types"
import type { Count, Id, Skip } from "integrations/domain/valueObjects"

/**
 * 通知
 */
export interface INotificationRepository {
  countNotifications(input: { userId: Id }): Promise<Count>

  hasUnreadNotifications(input: { userId: Id }): Promise<boolean>

  findNotifications(input: {
    skip: Skip
    userId: Id
  }): Promise<{
    notifications: (Notification & {
      friendship: (Friendship & { follower: UserWithIcon }) | null
      like:
        | (Like & {
            post: Post & {
              likes: Like[]
              quotation: EmbededPost | null
              quotations: Post[]
              replies: Post[]
              reply: EmbededPost | null
              user: UserWithIcon
            }
            user: UserWithIcon
          })
        | null
      post:
        | (Post & {
            likes: Like[]
            quotation: EmbededPost | null
            quotations: Post[]
            replies: Post[]
            reply: EmbededPost | null
            user: UserWithIcon
          })
        | null
    })[]
    notificationEntities: NotificationEntity[]
  }>

  upsertQuotationNotification(input: {
    quotationId: Id
    postUserId: Id
    postId: Id
  }): Promise<null>

  upsertPostLikeNotification(input: {
    likeId: Id
    postId: Id
    postUserId: Id
    userId: Id
  }): Promise<null>

  upsertFollowNotification(input: {
    followeeId: Id
    followerId: Id
    friendshipId: Id
  }): Promise<null>

  createReplyNotification(input: { replyId: Id; postUserId: Id }): Promise<null>

  markNotificationsAsRead(input: { userId: Id }): Promise<null>
}
