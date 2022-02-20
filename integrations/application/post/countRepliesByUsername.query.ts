import { captureException } from "@sentry/node"
import db from "db"
import { Username } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

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
