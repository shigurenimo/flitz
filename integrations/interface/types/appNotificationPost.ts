import { AppFeedPost } from "integrations/interface/types/appFeedPost"

export type AppNotificationPost = {
  id: string
  createdAt: Date
  type: "POST"
  isRead: boolean
  embedded: AppFeedPost
}
