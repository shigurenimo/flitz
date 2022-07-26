import SecurePassword from "secure-password"
import { HashedPassword, Password } from "integrations/domain/valueObjects"

/**
 * パスワードハッシュ
 */
export class HashedPasswordFactory {
  static async fromPassword(password: Password) {
    const securePassword = new SecurePassword()

    const passwordBuffer = Buffer.from(password.value)

    const hashedPasswordBuffer = await securePassword.hash(passwordBuffer)

    const hashedPassword = hashedPasswordBuffer.toString("base64")

    return new HashedPassword(hashedPassword)
  }
}
