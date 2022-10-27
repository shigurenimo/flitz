import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "integrations/errors"

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
      return new InternalError()
    }
  }
}
