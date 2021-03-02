import { QueryNotificationFollow } from "integrations/interface/types/queryNotificationFollow"
import { QueryNotificationLike } from "integrations/interface/types/queryNotificationLike"
import { QueryNotificationPost } from "integrations/interface/types/queryNotificationPost"

export type QueryNotification =
  | QueryNotificationFollow
  | QueryNotificationLike
  | QueryNotificationPost
  | null
