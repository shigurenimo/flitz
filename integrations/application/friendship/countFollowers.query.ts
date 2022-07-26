import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { Username } from "integrations/domain"
import { InternalError } from "integrations/errors"

type Props = {
  username: Username
}

@injectable()
export class CountFollowersQuery {
  async execute(props: Props) {
    try {
      const count = await db.friendship.count({
        where: { followee: { username: props.username.value } },
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
