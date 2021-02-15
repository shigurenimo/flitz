import db from "db"
import { Id } from "integrations/domain/valueObjects"

export class AccountsQuery {
  async findByUserId(userId: Id) {
    const account = await db.account.findUnique({
      where: { userId: userId.value },
    })

    if (account === null) return null

    return {
      email: account.email,
      userId: account.userId,
    }
  }
}
