import { PrismaEmbeddedUser } from "integrations/infrastructure/types/prismaEmbeddedUser"
import { PrismaPost } from "integrations/infrastructure/types/prismaPost"
import { AppPost } from "integrations/interface/types/appPost"
import { AppQuotation } from "integrations/interface/types/appQuotation"
import { AppUserEmbedded } from "integrations/interface/types/appUserEmbedded"

export class QueryConverter {
  toUserEmbedded(user: PrismaEmbeddedUser): AppUserEmbedded {
    return {
      id: user.id,
      biography: user.biography,
      iconImageId: user.iconImage?.id ?? null,
      name: user.name,
      username: user.username,
    }
  }

  toPost(
    post: PrismaPost & {
      quotation: PrismaPost | null
      reply: PrismaPost | null
    }
  ): AppPost {
    return {
      id: post.id,
      createdAt: post.createdAt,
      fileIds: post.files.map((file) => file.id),
      likesCount: post.likesCount,
      quotationsCount: post.quotationsCount,
      repliesCount: post.repliesCount,
      hasLike: (post.likes || []).length > 0,
      hasQuotation: (post.quotations || []).length > 0,
      hasReply: (post.replies || []).length > 0,
      text: post.text || null,
      user: this.toUserEmbedded(post.user),
      quotation: post.quotation ? this.toQuotation(post.quotation) : null,
      reply: post.reply ? this.toQuotation(post.reply) : null,
    }
  }

  toQuotation(post: PrismaPost): AppQuotation {
    return {
      id: post.id,
      createdAt: post.createdAt,
      fileIds: post.files.map((file) => file.id),
      likesCount: post.likesCount,
      quotationsCount: post.quotationsCount,
      repliesCount: post.repliesCount,
      hasLike: (post.likes || []).length > 0,
      hasQuotation: (post.quotations || []).length > 0,
      hasReply: (post.replies || []).length > 0,
      text: post.text || null,
      user: this.toUserEmbedded(post.user),
    }
  }
}
