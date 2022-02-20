import { captureException } from "@sentry/node"
import db from "db"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

@injectable()
export class CountPostsQuery {
  async execute() {
    try {
      const count = await db.post.count({})

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
