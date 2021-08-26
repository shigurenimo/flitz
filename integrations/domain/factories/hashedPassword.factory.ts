import {
  HashedPassword,
  HashedPasswordValue,
  Password,
} from "integrations/domain/valueObjects"
import SecurePassword from "secure-password"

/**
 * パスワードハッシュ
 */
export class HashedPasswordFactory {
  static nullable(value: HashedPasswordValue | null) {
    return value === null ? null : new HashedPassword(value)
  }

  static async fromPassword(password: Password) {
    const securePassword = new SecurePassword()

    const passwordBuffer = Buffer.from(password.value)

    const hashedPasswordBuffer = await securePassword.hash(passwordBuffer)

    const hashedPassword = hashedPasswordBuffer.toString("base64")

    return new HashedPassword(hashedPassword)
  }
}
