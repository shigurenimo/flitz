import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Username } from "core/valueObjects"
import db from "db"
import { InternalError } from "infrastructure/errors"

type Props = {
  username: Username
}

@injectable()
export class CountRepliesByUsernameQuery {
  async execute(props: Props) {
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
      return new InternalError()
    }
  }
}
