import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { PrismaPost } from "integrations/infrastructure"
import { AppPostConverter } from "integrations/infrastructure/converters"
import { includePostEmbedded } from "integrations/infrastructure/utils/includePostEmbedded"

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

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
