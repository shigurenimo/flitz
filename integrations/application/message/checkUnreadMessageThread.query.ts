import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
}

@injectable()
export class CheckUnreadMessageThreadQuery {
  async execute(props: Props) {
    try {
      const prismaMessageThread = await db.messageThread.findFirst({
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

      return prismaMessageThread !== null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
