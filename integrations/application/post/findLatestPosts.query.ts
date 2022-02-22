import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includePostEmbedded } from "integrations/infrastructure/utils/includePostEmbedded"
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
          quotation: { include: includePostEmbedded(props.userId) },
          quotations: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          replies: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          reply: { include: includePostEmbedded(props.userId) },
          user: { include: { iconImage: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 16,
      })

      return posts.map((post) => {
        return this.queryConverter.toPost(post)
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
