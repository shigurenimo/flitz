import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, Username } from "core/valueObjects"
import db from "db"
import { AppPostConverter } from "infrastructure"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"
import { InternalError } from "integrations/errors"

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
        orderBy: { createdAt: "desc" },
        skip: input.skip,
        take: input.take,
        where: { user: { username: input.username.value } },
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
      })

      return likes.map((like) => {
        return this.appPostConverter.fromPrisma(like.post)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
