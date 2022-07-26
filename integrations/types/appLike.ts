import { AppUserEmbedded } from "integrations/types"

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
