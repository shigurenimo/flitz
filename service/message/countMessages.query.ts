import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "infrastructure/errors"

type Props = {
  messageThreadId: Id
}

@injectable()
export class CountMessagesQuery {
  async execute(props: Props) {
    try {
      const count = await db.message.count({
        where: { id: props.messageThreadId.value },
      })

      return count
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
