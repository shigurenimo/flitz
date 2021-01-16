import * as z from "zod"

export const usernameSchema = z
  .string()
  .max(32)
  .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)

type UsernameValue = z.infer<typeof usernameSchema>

export class Username {
  constructor(public value: UsernameValue) {
    usernameSchema.parse(value)
    Object.freeze(this)
  }
}
