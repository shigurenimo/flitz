import type { NotificationEntity } from "domain/entities"

/**
 * 通知
 * @category Services
 */
export class NotificationService {
  /**
   * if there is an 'unread' notification
   * 通知の中に未読のものが混じっているかどうか
   */
  hasUnreadNotifications(input: {
    notificationEntities: NotificationEntity[]
  }) {
    const unreadNotifications = input.notificationEntities.filter(
      (notificationEntity) => {
        return !notificationEntity.isRead
      }
    )

    return unreadNotifications.length > 0
  }
}
