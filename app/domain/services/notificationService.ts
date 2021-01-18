import { Notification } from "db"

/**
 * ## 通知
 * @category Services
 */
export class NotificationService {
  /**
   * if there is an 'unread' notification
   * 通知の中に未読のものが混じっているかどうか
   */
  static hasUnreadNotifications(input: { notifications: Notification[] }) {
    const unreadNotifications = input.notifications.filter((notification) => {
      return !notification.isRead
    })

    return unreadNotifications.length > 0
  }
}
