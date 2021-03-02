import { QueryFeedPost } from "integrations/interface/types/queryFeedPost"

export type QueryNotificationPost = {
  id: string
  createdAt: Date
  type: "POST"
  isRead: boolean
  embedded: QueryFeedPost
}
