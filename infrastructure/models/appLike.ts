import { AppUserEmbedded } from "infrastructure/models"

/**
 * ライク
 */
export type AppLike = {
  id: string
  createdAt: Date
  isRead: boolean
  text: string
  updatedAt: Date
  user: AppUserEmbedded
}
