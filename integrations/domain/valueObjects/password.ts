import { SecurePassword } from "@blitzjs/auth"
import { z } from "zod"
import { HashedPassword } from "integrations/domain/valueObjects/hashedPassword"

const zValue = z.string().min(5).max(40)

/**
 * パスワード
 */
export class Password {
  readonly key = "PASSWORD"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
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
