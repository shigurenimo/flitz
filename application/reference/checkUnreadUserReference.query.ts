import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { Id } from "core/valueObjects"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
}

@injectable()
export class CheckUnreadUserReferenceQuery {
  async execute(props: Props) {
    try {
      const reference = await db.reference.findFirst({
        where: {
          isRead: false,
          userId: props.userId.value,
        },
      })

      return reference !== null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
