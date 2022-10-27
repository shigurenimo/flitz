import { injectable } from "tsyringe"
import { AppUserEmbeddedConverter } from "infrastructure/converters/appUserEmbedded.converter"
import { PrismaQuotation } from "infrastructure/types"
import { AppQuotation } from "integrations/types"

@injectable()
export class AppQuotationConverter {
  constructor(private userEmbeddedConverter: AppUserEmbeddedConverter) {}

  fromPrisma(post: PrismaQuotation): AppQuotation {
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
      user: this.userEmbeddedConverter.fromPrisma(post.user),
    }
  }
}
