import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  userId: Id | null
}

@injectable()
export class FindLatestPostsQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    try {
      const posts = await db.post.findMany({
        include: {
          files: true,
          likes: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          quotation: { include: includeReplyPost(props.userId) },
          quotations: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          replies: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          reply: { include: includeReplyPost(props.userId) },
          user: { include: { iconImage: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 16,
      })

      return posts.map((post) => {
        return this.queryConverter.toFeedPost(post)
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
