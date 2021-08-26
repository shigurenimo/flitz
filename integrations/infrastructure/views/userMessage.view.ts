import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id } from "integrations/domain/valueObjects"

@Injectable()
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

    return new Count(count)
  }
}
