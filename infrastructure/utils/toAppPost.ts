import { PrismaPost } from "infrastructure/types"
import { toAppQuotation } from "infrastructure/utils/toAppQuotation"
import { toAppUserEmbedded } from "infrastructure/utils/toAppUserEmbedded"
import { AppPost } from "integrations/types"

export const toAppPost = (post: PrismaPost): AppPost => {
  return {
    id: post.id,
    createdAt: post.createdAt,
    fileIds: post.files.map((file) => {
      return file.id
    }),
    likesCount: post.likesCount,
    quotationsCount: post.quotationsCount,
    repliesCount: post.repliesCount,
    hasLike: 0 < (post.likes || []).length,
    hasQuotation: 0 < (post.quotations || []).length,
    hasReply: 0 < (post.replies || []).length,
    text: post.text || null,
    user: toAppUserEmbedded(post.user),
    quotation: post.quotation ? toAppQuotation(post.quotation) : null,
    reply: post.reply ? toAppQuotation(post.reply) : null,
  }
}
