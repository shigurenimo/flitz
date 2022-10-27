import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "integrations/errors"

@injectable()
export class FindUserSimpleQuery {
  /**
   * @deprecated
   * @param userId
   */
  async execute(userId: Id) {
    try {
      const user = await db.user.findUnique({
        where: { id: userId.value },
      })

      if (user === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      return {
        email: user.email,
        userId: user.id,
      }
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
