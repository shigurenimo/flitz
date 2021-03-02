import { UserEntity } from "integrations/domain/entities"
import type { Email, Id, Username } from "integrations/domain/valueObjects"

/**
 * ユーザー・リポジトリ
 */
export abstract class UserRepository {
  /**
   * @param input
   * @returns
   */
  abstract find(id: Id): Promise<UserEntity | null>

  /**
   * @param input
   * @returns
   */
  abstract findByEmail(email: Email): Promise<UserEntity | null>

  /**
   * @param input
   * @returns
   */
  abstract findByUsername(username: Username): Promise<UserEntity | null>

  /**
   * ユーザーを更新する
   * @param input
   */
  abstract upsert(userEntity: UserEntity): Promise<null | Error>
}
