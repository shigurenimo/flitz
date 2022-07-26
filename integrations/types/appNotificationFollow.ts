import { AppUserEmbedded } from "integrations/types"

/**
 * 通知（フォロー）
 */
export type AppNotificationFollow = {
  id: string
  createdAt: Date
  type: "FOLLOW"
  isRead: boolean
  embedded: AppUserEmbedded
}
