import { AppMessageEmbedded, AppUserEmbedded } from "infrastructure/models"

/**
 * メッセージのスレッド
 */
export type AppMessageThread = {
  id: string
  createdAt: Date
  isRead: boolean
  lastMessage: AppMessageEmbedded
  relatedUser: AppUserEmbedded
}
