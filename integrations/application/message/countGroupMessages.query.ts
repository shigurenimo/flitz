import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  relatedUserId: Id
}

@injectable()
export class CountGroupMessagesQuery {
  async execute(props: Props) {
    try {
      const count = await db.message.count({
        where: {
          threads: {
            some: {
              userId: props.userId.value,
              relatedUserId: props.relatedUserId.value,
            },
          },
        },
      })

      return count
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
