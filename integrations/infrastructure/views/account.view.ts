import { Injectable } from "@nestjs/common"
import db from "db"
import { Id } from "integrations/domain/valueObjects"

@Injectable()
export class AccountQuery {
  /**
   * @deprecated
   * @param userId
   */
  async findByUserId(userId: Id) {
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
