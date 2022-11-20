import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { InternalError } from "infrastructure/errors"

type Props = {
  userId: Id
}

@injectable()
export class CheckUnreadMessageThreadQuery {
  async execute(props: Props) {
    try {
      const messageThread = await db.messageThread.findFirst({
        where: {
          messages: {
            some: {
              isRead: false,
              userId: { not: props.userId.value },
            },
          },
          userId: props.userId.value,
        },
      })

      return messageThread !== null
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
