import * as z from "zod"

export const nameSchema = z.string().max(32)

export type NameValue = z.infer<typeof nameSchema>

export class Name {
  constructor(public value: NameValue) {
    nameSchema.parse(value)
    Object.freeze(this)
  }

  static nullable(value: NameValue | null) {
    return value === null ? null : new Name(value)
  }

  static fromEmail(value: NameValue) {
    return new Name(value.substring(0, value.lastIndexOf("@")))
  }
}
