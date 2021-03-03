import { SecurePassword } from "blitz"
import { HashedPassword, Password } from "integrations/domain/valueObjects"

/**
 * パスワード
 */
export class PasswordService {
  /**
   * パスワードをハッシュ化する
   * @param password
   * @returns
   */
  async hashPassword(password: Password) {
    const improvedHash = await SecurePassword.hash(password.value)

    return new HashedPassword(improvedHash)
  }

  /**
   * パスワードを検証する
   * @param hashedPassword
   * @param password
   * @returns
   */
  async verifyPassword(hashedPassword: HashedPassword, password: Password) {
    try {
      const result = await SecurePassword.verify(
        hashedPassword.value,
        password.value
      )

      return result
    } catch (error) {
      return error
    }
  }

  /**
   * 再度ハッシュ化が必要であるかどうか
   * @param result
   * @returns
   */
  needsRehash(result: symbol) {
    return result === SecurePassword.VALID_NEEDS_REHASH
  }

  /**
   * パスワードが間違っているかどうか
   * @param result
   * @returns
   */
  isInvalid(result: symbol) {
    return (
      result !== SecurePassword.VALID &&
      result !== SecurePassword.VALID_NEEDS_REHASH
    )
  }
}
