import { Email } from "app/domain/valueObjects/email"
import { HashedPassword } from "app/domain/valueObjects/hashedPassword"
import { Id } from "app/domain/valueObjects/id"
import db from "db"

export class AccountRepository {
  static async findAccountByEmail(email: Email) {
    return await db.account.findUnique({
      where: { email: email.value },
      include: { user: true },
    })

    /*
    if (account === null) return null

    return AccountEntity.fromData(account)
    */
  }

  static async updateAccount(input: {
    id: Id
    hashedPassword: HashedPassword
  }) {
    await db.account.update({
      where: { id: input.id.value },
      data: { hashedPassword: input.hashedPassword.value },
    })
  }
}
