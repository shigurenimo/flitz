import { z } from "zod"

const zValue = z
  .string()
  .max(32)
  .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)

/**
 * ユーザーネーム
 */
export class Username {
  readonly key = "USERNAME"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
