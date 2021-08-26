import { AppNotificationFollow } from "integrations/interface/types/appNotificationFollow"
import { AppNotificationLike } from "integrations/interface/types/appNotificationLike"
import { AppNotificationPost } from "integrations/interface/types/appNotificationPost"

export type AppNotification =
  | AppNotificationFollow
  | AppNotificationLike
  | AppNotificationPost
  | null
