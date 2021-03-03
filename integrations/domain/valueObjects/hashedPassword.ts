import * as z from "zod"

export const zHashedPassword = z.string()

export type HashedPasswordValue = z.infer<typeof zHashedPassword>

/**
 * パスワードハッシュ
 */
export class HashedPassword {
  constructor(public value: HashedPasswordValue) {
    zHashedPassword.parse(value)
    Object.freeze(this)
  }
}
