import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class MarkNotificationAsReadService {
  async execute(props: Props) {
    try {
      if (props.userId === null) {
        return null
      }

      await db.notification.updateMany({
        data: { isRead: true },
        where: {
          userId: props.userId.value,
          isRead: false,
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
