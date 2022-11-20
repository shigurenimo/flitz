import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Username } from "core"
import db from "db"
import { InternalError } from "infrastructure/errors"

type Props = {
  username: Username
}

@injectable()
export class CountFolloweesQuery {
  async execute(props: Props) {
    try {
      const count = await db.friendship.count({
        where: { follower: { username: props.username.value } },
      })

      return count
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
