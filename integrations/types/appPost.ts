import { AppQuotation, AppUserEmbedded } from "integrations/types"

/**
 * ポスト
 */
export type AppPost = {
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
  quotation: AppQuotation | null
  reply: AppQuotation | null
}
