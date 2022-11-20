import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { InternalError } from "infrastructure/errors"

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
          threads: {
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
      return new InternalError()
    }
  }
}
