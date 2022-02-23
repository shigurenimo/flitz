import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

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

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
