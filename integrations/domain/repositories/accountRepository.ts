import type { File, User } from "db"
import type { AccountEntity } from "integrations/domain/entities"
import type {
  Email,
  HashedPassword,
  Id,
} from "integrations/domain/valueObjects"

/**
 * アカウント
 */
export interface IAccountRepository {
  /**
   * ユーザーIDでアカウントを探す
   * TODO: 削除する
   * @deprecated
   * @param email
   * @returns
   */
  findByUserId(userId: Id): Promise<AccountEntity | null>

  /**
   * メールアドレスで指定しアカウントを取得する
   * TODO: 削除する
   * @deprecated
   * @param email
   * @returns
   */
  findByEmail(
    email: Email
  ): Promise<{
    account: { user: User & { iconImage: File | null } } | null
    accountEntity: AccountEntity | null
  }>

  /**
   * アカウントを更新する
   * TODO: 集約
   * @deprecated
   * @param input
   */
  updateByUserId(userId: Id, input: { email: Email }): Promise<null>

  /**
   * アカウントのパスワードを更新する
   * TODO: 集約
   * @deprecated
   * @param input
   */
  update(input: { id: Id; hashedPassword: HashedPassword }): Promise<null>
}
