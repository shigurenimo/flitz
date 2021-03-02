import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"
import { QueryLikePost } from "integrations/interface/types/queryLikePost"

export type QueryNotificationLike = {
  id: string
  createdAt: Date
  type: "LIKE"
  isRead: boolean
  embedded: QueryLikePost & { user: QueryEmbeddedUser }
}
