import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
}

@injectable()
export class CountUserReferencesQuery {
  async execute(props: Props) {
    try {
      const count = await db.post.count({
        where: { userId: props.userId.value },
      })

      return count
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
