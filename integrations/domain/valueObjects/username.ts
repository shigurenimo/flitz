import * as z from "zod"

export const zUsername = z
  .string()
  .max(32)
  .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)

type UsernameValue = z.infer<typeof zUsername>

/**
 * ユーザーネーム
 */
export class Username {
  constructor(public value: UsernameValue) {
    zUsername.parse(value)
    Object.freeze(this)
  }
}
