import * as z from "zod"

export const passwordSchema = z.string().min(5).max(40)

export type PasswordValue = z.infer<typeof passwordSchema>

/**
 * ## パスワード
 */
export class Password {
  constructor(public value: PasswordValue) {
    passwordSchema.parse(value)
    Object.freeze(this)
  }
}
