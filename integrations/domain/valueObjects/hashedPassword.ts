import { z } from "zod"

const zValue = z.string()

/**
 * パスワードハッシュ
 */
export class HashedPassword {
  readonly key = "HASHED_PASSWORD"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
