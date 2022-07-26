import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { Id, Username } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { AppPostConverter } from "integrations/infrastructure"
import { includePostEmbedded } from "integrations/infrastructure/utils/includePostEmbedded"

type Props = {
  skip: number
  take: number
  userId: Id | null
  username: Username
}

@injectable()
export class FindUserPostsQuery {
  constructor(private appPostConverter: AppPostConverter) {}

  async execute(props: Props) {
    try {
      const posts = await db.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: props.take,
        where: { user: { username: props.username.value } },
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
      })

      return posts.map((post) => {
        return this.appPostConverter.fromPrisma(post)
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
