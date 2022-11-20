import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { InternalError } from "infrastructure/errors"
import { toAppQuotation } from "infrastructure/utils"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"

type Props = {
  skip: number
  take: number
  replyId: Id
  userId: Id | null
}

@injectable()
export class FindUserRepliesQuery {
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
        return toAppQuotation(post)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
