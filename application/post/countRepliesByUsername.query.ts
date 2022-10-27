import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Username } from "core/valueObjects"
import db from "db"
import { InternalError } from "integrations/errors"

type Props = {
  username: Username
}

@injectable()
export class CountRepliesByUsernameQuery {
  async count(props: Props) {
    try {
      const count = await db.post.count({
        where: {
          user: { username: props.username.value },
          replyId: { not: null },
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
