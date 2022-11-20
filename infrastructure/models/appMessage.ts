import { AppUserEmbedded } from "infrastructure/models"

/**
 * メッセージ
 */
export type AppMessage = {
  id: string
  createdAt: Date
  isRead: boolean
  text: string
  updatedAt: Date
  user: AppUserEmbedded
}
