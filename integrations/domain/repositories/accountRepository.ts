import type { Account, File, User } from "db"
import type { AccountEntity } from "integrations/domain/entities"
import type { Email, HashedPassword, Id } from "integrations/domain/valueObjects"

/**
 * アカウント
 */
export interface IAccountRepository {
  /**
   * ユーザーIDでアカウントを探す
   * @param email
   * @returns
   */
  findByUserId(
    userId: Id
  ): Promise<{
    account: (Account & { user: User }) | null
    accountEntity: AccountEntity | null
  }>

  /**
   * メールアドレスで指定しアカウントを取得する
   * @param email
   * @returns
   */
  getAccountByEmail(
    email: Email
  ): Promise<{
    account: { user: User & { iconImage: File | null } } | null
    accountEntity: AccountEntity | null
  }>

  /**
   * アカウントを更新する
   * @param input
   */
  updateByUserId(userId: Id, input: { email: Email }): Promise<null>

  /**
   * アカウントのパスワードを更新する
   * @param input
   */
  updateHashedPassword(input: {
    id: Id
    hashedPassword: HashedPassword
  }): Promise<null>
}
