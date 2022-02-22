import { AppUserEmbedded } from "integrations/interface/types"

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
