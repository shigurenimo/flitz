import db from "db"
import { Count, Id } from "integrations/domain/valueObjects"

export class UserMessageQuery {
  async count(input: { relatedUserId: Id; userId: Id }) {
    const count = await db.message.count({
      where: {
        exchanges: {
          some: {
            userId: input.userId.value,
            relatedUserId: input.relatedUserId.value,
          },
        },
      },
    })

    return new Count(count)
  }
}
