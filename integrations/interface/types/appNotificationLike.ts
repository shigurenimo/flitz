import { AppPostEmbedded, AppUserEmbedded } from "integrations/interface/types"

/**
 * 通知（ライク）
 */
export type AppNotificationLike = {
  id: string
  createdAt: Date
  type: "LIKE"
  isRead: boolean
  embedded: AppPostEmbedded & { user: AppUserEmbedded }
}
