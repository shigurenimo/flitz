import { z } from "zod"

const zValue = z.string()

/**
 * パスワードハッシュ
 */
export class HashedPassword {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
