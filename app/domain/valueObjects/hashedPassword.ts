import { Password } from "app/domain/valueObjects/password"
import SecurePassword from "secure-password"
import * as z from "zod"

export const hashedPasswordSchema = z.string()

export type HashedPasswordValue = z.infer<typeof hashedPasswordSchema>

export class HashedPassword {
  constructor(public value: HashedPasswordValue) {
    hashedPasswordSchema.parse(value)
    Object.freeze(this)
  }

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
