import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "infrastructure/errors"

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
      return new InternalError()
    }
  }
}
