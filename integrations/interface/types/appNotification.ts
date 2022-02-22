import {
  AppNotificationFollow,
  AppNotificationLike,
  AppNotificationPost,
} from "integrations/interface/types"

/**
 * 通知
 */
export type AppNotification =
  | AppNotificationFollow
  | AppNotificationLike
  | AppNotificationPost
