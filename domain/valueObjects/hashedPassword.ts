import * as z from "zod"

export const hashedPasswordSchema = z.string()

export type HashedPasswordValue = z.infer<typeof hashedPasswordSchema>

/**
 * ## パスワードハッシュ
 */
export class HashedPassword {
  constructor(public value: HashedPasswordValue) {
    hashedPasswordSchema.parse(value)
    Object.freeze(this)
  }
}
