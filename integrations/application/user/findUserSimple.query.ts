import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

@injectable()
export class FindUserSimpleQuery {
  /**
   * @deprecated
   * @param userId
   */
  async execute(userId: Id) {
    const user = await db.user.findUnique({
      where: { id: userId.value },
    })

    if (user === null) return null

    return {
      email: user.email,
      userId: user.id,
    }
  }
}
