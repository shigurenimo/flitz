import { AppUserEmbedded } from "infrastructure/models"

/**
 * リポスト
 */
export type AppQuotation = {
  id: string
  createdAt: Date
  fileIds: string[]
  likesCount: number
  quotationsCount: number
  repliesCount: number
  hasLike: boolean
  hasQuotation: boolean
  hasReply: boolean
  text: string | null
  user: AppUserEmbedded
}
