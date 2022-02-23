import { AppUserEmbeddedConverter } from "integrations/infrastructure/converters/appUserEmbedded.converter"
import { PrismaQuotation } from "integrations/infrastructure/types"
import { AppQuotation } from "integrations/interface/types"
import { injectable } from "tsyringe"

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
      hasLike: (post.likes || []).length > 0,
      hasQuotation: (post.quotations || []).length > 0,
      hasReply: (post.replies || []).length > 0,
      text: post.text || null,
      user: this.userEmbeddedConverter.fromPrisma(post.user),
    }
  }
}
