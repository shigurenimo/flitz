import { AppUserEmbedded } from "infrastructure/models"

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
