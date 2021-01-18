import { HashedPassword } from "app/domain/valueObjects/hashedPassword"
import { Password } from "app/domain/valueObjects/password"
import SecurePassword from "secure-password"

/**
 * ## パスワード
 */
export class PasswordService {
  /**
   * パスワードをハッシュ化する
   * @param password
   * @returns
   */
  static async hashPassword(password: Password) {
    const passwordBuffer = Buffer.from(password.value)

    const securePassword = new SecurePassword()

    const hashedBuffer = await securePassword.hash(passwordBuffer)

    const string = hashedBuffer.toString("base64")

    return new HashedPassword(string)
  }

  /**
   * パスワードを検証する
   * @param hashedPassword
   * @param password
   * @returns
   */
  static verifyPassword(hashedPassword: HashedPassword, password: Password) {
    try {
      const passwordBuffer = Buffer.from(password.value)

      const hashedPasswordBuffer = Buffer.from(hashedPassword.value, "base64")

      const securePassword = new SecurePassword()

      return securePassword.verify(passwordBuffer, hashedPasswordBuffer)
    } catch (error) {
      return error
    }
  }

  /**
   * 再度ハッシュ化が必要であるかどうか
   * @param result
   * @returns
   */
  static needsRehash(result: symbol) {
    return result === SecurePassword.VALID_NEEDS_REHASH
  }

  /**
   * パスワードが間違っているかどうか
   * @param result
   * @returns
   */
  static isInvalid(result: symbol) {
    return (
      result !== SecurePassword.VALID &&
      result !== SecurePassword.VALID_NEEDS_REHASH
    )
  }
}
