import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, Username } from "core/valueObjects"
import db from "db"
import { InternalError } from "infrastructure/errors"
import { toAppPost } from "infrastructure/utils"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"

type Props = {
  skip: number
  take: number
  userId: Id | null
  username: Username
}

@injectable()
export class FindUserPostsQuery {
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
        return toAppPost(post)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
