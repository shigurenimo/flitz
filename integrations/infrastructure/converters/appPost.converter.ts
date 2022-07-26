import { injectable } from "tsyringe"
import { AppQuotationConverter } from "integrations/infrastructure/converters/appQuotation.converter"
import { AppUserEmbeddedConverter } from "integrations/infrastructure/converters/appUserEmbedded.converter"
import { PrismaPost } from "integrations/infrastructure/types"
import { AppPost } from "integrations/interface/types"

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
      hasLike: (post.likes || []).length > 0,
      hasQuotation: (post.quotations || []).length > 0,
      hasReply: (post.replies || []).length > 0,
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
