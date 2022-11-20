import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "infrastructure/errors"
import { toAppUserMessage } from "infrastructure/utils/toAppUserMessage"

type Props = {
  messageThreadId: Id
  skip: number
}

@injectable()
export class FindGroupMessagesQuery {
  async execute(props: Props) {
    try {
      const messageThread = await db.messageThread.findUnique({
        where: { id: props.messageThreadId.value },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 20,
            skip: props.skip,
            include: {
              user: { include: { iconImage: true } },
            },
          },
        },
      })

      if (messageThread === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      return messageThread.messages.map((prismaMessage) => {
        return toAppUserMessage(prismaMessage)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
