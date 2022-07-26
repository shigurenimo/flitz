import { AppMessageEmbedded, AppUserEmbedded } from "integrations/types"

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
