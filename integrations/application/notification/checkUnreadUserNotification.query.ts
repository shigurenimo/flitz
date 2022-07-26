import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
}

@injectable()
export class CheckUnreadUserNotificationQuery {
  async execute(props: Props) {
    try {
      const notification = await db.notification.findFirst({
        where: {
          isRead: false,
          userId: props.userId.value,
        },
      })

      return notification !== null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
