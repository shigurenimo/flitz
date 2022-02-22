import { AppPost } from "integrations/interface/types"

/**
 * 通知（ポスト）
 */
export type AppNotificationPost = {
  id: string
  createdAt: Date
  type: "POST"
  isRead: boolean
  embedded: AppPost
}
