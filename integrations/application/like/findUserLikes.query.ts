import { captureException } from "@sentry/node"
import db from "db"
import { Id, Username } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { AppPostConverter } from "integrations/infrastructure"
import { includePostEmbedded } from "integrations/infrastructure/utils/includePostEmbedded"
import { injectable } from "tsyringe"

type Props = {
  userId: Id | null
  skip: number
  take: number
  username: Username
}

@injectable()
export class FindUserLikeQuery {
  constructor(private appPostConverter: AppPostConverter) {}

  async execute(input: Props) {
    try {
      const likes = await db.like.findMany({
        include: {
          post: {
            include: {
              files: true,
              likes: input.userId
                ? { where: { userId: input.userId.value } }
                : false,
              quotation: { include: includePostEmbedded(input.userId) },
              quotations: input.userId
                ? { where: { userId: input.userId.value } }
                : false,
              replies: input.userId
                ? { where: { userId: input.userId.value } }
                : false,
              reply: { include: includePostEmbedded(input.userId) },
              user: { include: { iconImage: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: input.skip,
        take: input.take,
        where: { user: { username: input.username.value } },
      })

      return likes.map((like) => {
        return this.appPostConverter.fromPrisma(like.post)
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
