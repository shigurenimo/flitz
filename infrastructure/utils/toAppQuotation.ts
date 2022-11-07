import { PrismaQuotation } from "infrastructure/types"
import { toAppUserEmbedded } from "infrastructure/utils/toAppUserEmbedded"
import { AppQuotation } from "integrations/types"

export const toAppQuotation = (post: PrismaQuotation): AppQuotation => {
  return {
    id: post.id,
    createdAt: post.createdAt,
    fileIds: post.files.map((file) => file.id),
    likesCount: post.likesCount,
    quotationsCount: post.quotationsCount,
    repliesCount: post.repliesCount,
    hasLike: 0 < (post.likes || []).length,
    hasQuotation: 0 < (post.quotations || []).length,
    hasReply: 0 < (post.replies || []).length,
    text: post.text || null,
    user: toAppUserEmbedded(post.user),
  }
}
