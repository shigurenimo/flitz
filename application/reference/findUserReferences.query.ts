import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { AppPostConverter } from "infrastructure"
import { PrismaReference } from "infrastructure/types"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"
import { InternalError } from "integrations/errors"
import { AppFolloweePost } from "integrations/types"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindUserReferenceQuery {
  constructor(private appPostConverter: AppPostConverter) {}

  async execute(props: Props) {
    try {
      const references = await db.reference.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 16,
        where: { userId: props.userId.value },
        include: {
          post: {
            include: {
              files: true,
              likes: { where: { userId: props.userId.value } },
              quotation: { include: includePostEmbedded(props.userId) },
              quotations: { where: { userId: props.userId.value } },
              replies: { where: { userId: props.userId.value } },
              reply: { include: includePostEmbedded(props.userId) },
              user: { include: { iconImage: true } },
            },
          },
        },
      })

      return references.map((reference) => {
        return this.toFolloweePost(reference)
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }

  toFolloweePost(feed: PrismaReference): AppFolloweePost {
    return {
      ...this.appPostConverter.fromPrisma(feed.post),
      isRead: feed.isRead,
    }
  }
}
