import * as z from "zod"

export const nameSchema = z.string().max(32)

export type NameValue = z.infer<typeof nameSchema>

/**
 * ## ユーザー名
 */
export class Name {
  constructor(public value: NameValue) {
    nameSchema.parse(value)
    Object.freeze(this)
  }

  static nullable(value: NameValue | null) {
    return value === null ? null : new Name(value)
  }
}
