import { injectable } from "tsyringe"
import { AppQuotationConverter } from "infrastructure/converters/appQuotation.converter"
import { AppUserEmbeddedConverter } from "infrastructure/converters/appUserEmbedded.converter"
import { PrismaPost } from "infrastructure/types"
import { AppPost } from "integrations/types"

@injectable()
export class AppPostConverter {
  constructor(
    private appQuotationConverter: AppQuotationConverter,
    private appUserEmbeddedConverter: AppUserEmbeddedConverter
  ) {}

  fromPrisma(post: PrismaPost): AppPost {
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
      user: this.appUserEmbeddedConverter.fromPrisma(post.user),
      quotation: post.quotation
        ? this.appQuotationConverter.fromPrisma(post.quotation)
        : null,
      reply: post.reply
        ? this.appQuotationConverter.fromPrisma(post.reply)
        : null,
    }
  }
}
