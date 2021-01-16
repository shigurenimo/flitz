import { Notification } from "db"

export class NotificationService {
  static hasUnreadNotifications(input: { notifications: Notification[] }) {
    const unreadNotifications = input.notifications.filter((notification) => {
      return !notification.isRead
    })

    return unreadNotifications.length > 0
  }
}
