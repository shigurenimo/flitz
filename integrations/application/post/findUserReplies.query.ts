import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { PrismaPost } from "integrations/infrastructure/types"
import { includePostEmbedded } from "integrations/infrastructure/utils/includePostEmbedded"
import { AppQuotation } from "integrations/interface/types"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  take: number
  replyId: Id
  userId: Id | null
}

@injectable()
export class FindUserRepliesQuery {
  constructor(private queryConverter: QueryConverter) {}

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
      user: this.queryConverter.toUserEmbedded(post.user),
    }
  }
}
