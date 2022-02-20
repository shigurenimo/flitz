import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  relatedUserId: Id
}

@injectable()
export class MarkMessagesAsReadService {
  async execute(props: Props) {
    try {
      await db.message.updateMany({
        data: { isRead: true },
        where: {
          exchanges: {
            some: {
              userId: props.relatedUserId.value,
              relatedUserId: props.userId.value,
              isRead: false,
            },
          },
        },
      })

      return null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
