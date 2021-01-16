import * as z from "zod"

export const emailSchema = z.string().email()

export type EmailValue = z.infer<typeof emailSchema>

export class Email {
  constructor(public value: EmailValue) {
    emailSchema.parse(value)
    this.value = value.toLowerCase()
    Object.freeze(this)
  }

  username() {
    return this.value.substring(0, this.value.lastIndexOf("@"))
  }
}
