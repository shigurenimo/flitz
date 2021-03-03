import * as z from "zod"

export const zName = z.string().max(12)

export type NameValue = z.infer<typeof zName>

/**
 * ユーザー名
 */
export class Name {
  constructor(public value: NameValue) {
    zName.parse(value)
    Object.freeze(this)
  }

  static nullable(value: NameValue | null) {
    return value === null ? null : new Name(value)
  }
}
