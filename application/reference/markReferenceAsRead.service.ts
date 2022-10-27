import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
}

@injectable()
export class MarkReferenceAsReadService {
  async execute(props: Props) {
    try {
      await db.reference.updateMany({
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
