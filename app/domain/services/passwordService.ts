import { HashedPassword } from "app/domain/valueObjects/hashedPassword"
import { Password } from "app/domain/valueObjects/password"
import SecurePassword from "secure-password"

export class PasswordService {
  static async hashPassword(password: Password) {
    const passwordBuffer = Buffer.from(password.value)

    const securePassword = new SecurePassword()

    const hashedBuffer = await securePassword.hash(passwordBuffer)

    const string = hashedBuffer.toString("base64")

    return new HashedPassword(string)
  }

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

  static needsRehash(result: symbol) {
    return result === SecurePassword.VALID_NEEDS_REHASH
  }

  static isInvalid(result: symbol) {
    return (
      result !== SecurePassword.VALID &&
      result !== SecurePassword.VALID_NEEDS_REHASH
    )
  }
}
