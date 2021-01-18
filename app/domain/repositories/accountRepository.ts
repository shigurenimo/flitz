import { Email } from "app/domain/valueObjects/email"
import { HashedPassword } from "app/domain/valueObjects/hashedPassword"
import { Id } from "app/domain/valueObjects/id"
import db from "db"

/**
 * ## アカウント
 */
export class AccountRepository {
  /**
   * メールアドレスで指定しアカウントを取得する
   * @param email
   * @returns
   */
  static async getAccountByEmail(email: Email) {
    return await db.account.findUnique({
      where: { email: email.value },
      include: { user: true },
    })

    /*
    if (account === null) return null

    return AccountEntity.fromData(account)
    */
  }

  /**
   * アカウントを更新する
   * @param input
   */
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
