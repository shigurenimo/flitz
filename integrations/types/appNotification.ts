import {
  AppNotificationFollow,
  AppNotificationLike,
  AppNotificationPost,
} from "integrations/types"

/**
 * 通知
 */
export type AppNotification =
  | AppNotificationFollow
  | AppNotificationLike
  | AppNotificationPost
