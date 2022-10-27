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
      const prismaPosts = await db.post.findMany({
        include: includePostEmbedded(props.userId),
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: props.take,
        where: { replyId: props.replyId.value },
      })

      return prismaPosts.map((post) => {
        return this.toQuotation(post)
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

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
      hasLike: (post.likes || []).length > 0,
      hasQuotation: (post.quotations || []).length > 0,
      hasReply: (post.replies || []).length > 0,
      text: post.text || null,
      user: this.appUserEmbeddedConverter.fromPrisma(post.user),
    }
  }
}
