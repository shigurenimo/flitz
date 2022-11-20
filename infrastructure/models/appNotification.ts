import {
  AppNotificationFollow,
  AppNotificationLike,
  AppNotificationPost,
} from "infrastructure/models"

/**
 * 通知
 */
export type AppNotification =
  | AppNotificationFollow
  | AppNotificationLike
  | AppNotificationPost
