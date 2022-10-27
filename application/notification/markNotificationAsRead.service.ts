import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
}

@injectable()
export class MarkNotificationAsReadService {
  async execute(props: Props) {
    try {
      const transaction = await db.notification.updateMany({
        data: { isRead: true },
        where: {
          userId: props.userId.value,
          isRead: false,
        },
      })

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return null
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
