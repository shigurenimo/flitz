import { SecurePassword } from "blitz"
import { HashedPassword } from "integrations/domain"
import * as z from "zod"

export const zPassword = z.string().min(5).max(40)

export type PasswordValue = z.infer<typeof zPassword>

/**
 * パスワード
 */
export class Password {
  constructor(public value: PasswordValue) {
    zPassword.parse(value)
    Object.freeze(this)
  }

  /**
   * パスワードをハッシュ化する
   * @param password
   * @returns
   */
  async toHashPassword(password: Password) {
    const hashedPassword = await SecurePassword.hash(password.value)

    return new HashedPassword(hashedPassword)
  }
}
