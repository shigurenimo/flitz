import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { PrismaPost } from "infrastructure"
import { AppPostConverter } from "infrastructure/converters"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"
import { InternalError } from "integrations/errors"

type Props = {
  postId: Id
  userId: Id | null
}

@injectable()
export class FindPostQuery {
  constructor(private appPostConverter: AppPostConverter) {}

  async execute(props: Props) {
    try {
      const post: PrismaPost | null = await db.post.findUnique({
        where: { id: props.postId.value },
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

      if (post === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      return this.appPostConverter.fromPrisma(post)
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
