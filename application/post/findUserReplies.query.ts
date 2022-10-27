import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { AppUserEmbeddedConverter } from "infrastructure/converters"
import { PrismaQuotation } from "infrastructure/types"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"
import { InternalError } from "integrations/errors"
import { AppQuotation } from "integrations/types"

type Props = {
  skip: number
  take: number
  replyId: Id
  userId: Id | null
}

@injectable()
export class FindUserRepliesQuery {
  constructor(private appUserEmbeddedConverter: AppUserEmbeddedConverter) {}

  async execute(props: Props) {
    try {
      const posts = await db.post.findMany({
        include: includePostEmbedded(props.userId),
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: props.take,
        where: { replyId: props.replyId.value },
      })

      return posts.map((post) => {
        return this.toQuotation(post)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }

  toQuotation(post: PrismaQuotation): AppQuotation {
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
    }
  }
}
