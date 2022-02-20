import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
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
      const posts = await db.post.findMany({
        include: includeReplyPost(props.userId),
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: props.take,
        where: { replyId: props.replyId.value },
      })

      return posts.map((post) => {
        return this.queryConverter.toQuotation(post)
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
