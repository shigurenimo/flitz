import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "infrastructure/errors"
import { toAppUserMessage } from "infrastructure/utils"

type Props = {
  relatedUserId: Id
  skip: number
  userId: Id
}

@injectable()
export class FindUserMessagesQuery {
  async execute(props: Props) {
    try {
      const messages = await db.message.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 20,
        where: {
          threads: {
            some: { userId: props.userId.value },
          },
        },
        include: {
          user: { include: { iconImage: true } },
        },
      })

      return messages.map((prismaMessage) => {
        return toAppUserMessage(prismaMessage)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
