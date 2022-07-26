import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { Username } from "integrations/domain"
import { InternalError } from "integrations/errors"

type Props = {
  username: Username
}

@injectable()
export class CountUserPostsQuery {
  async execute(props: Props) {
    try {
      const count = await db.post.count({
        where: { user: { username: props.username.value } },
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
