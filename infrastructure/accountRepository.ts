import db from "db"
import { Email, HashedPassword, Id } from "domain/valueObjects"

/**
 * ## アカウント
 */
export class AccountRepository {
  /**
   * ユーザーIDでアカウントを探す
   * @param email
   * @returns
   */
  static async findByUserId(userId: Id) {
    return await db.account.findUnique({
      where: { userId: userId.value },
    })

    /*
    if (account === null) return null

    return AccountEntity.fromData(account)
    */
  }

  /**
   * メールアドレスで指定しアカウントを取得する
   * @param email
   * @returns
   */
  static async getAccountByEmail(email: Email) {
    return await db.account.findUnique({
      where: { email: email.value },
      include: {
        user: { include: { iconImage: true } },
      },
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
  static async updateByUserId(userId: Id, input: { email: Email }) {
    await db.account.update({
      where: { userId: userId.value },
      data: {
        email: input.email.value,
      },
    })
  }

  /**
   * アカウントのパスワードを更新する
   * @param input
   */
  static async updateHashedPassword(input: {
    id: Id
    hashedPassword: HashedPassword
  }) {
    await db.account.update({
      where: { id: input.id.value },
      data: { hashedPassword: input.hashedPassword.value },
    })
  }
}
