import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

@injectable()
export class UserMessageQuery {
  async count(userId: Id, relatedUserId: Id) {
    const count = await db.message.count({
      where: {
        exchanges: {
          some: {
            userId: userId.value,
            relatedUserId: relatedUserId.value,
          },
        },
      },
    })

    return count
  }
}
