import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"
import { AppLikePost } from "integrations/interface/types/appLikePost"

export type AppNotificationLike = {
  id: string
  createdAt: Date
  type: "LIKE"
  isRead: boolean
  embedded: AppLikePost & { user: AppEmbeddedUser }
}
