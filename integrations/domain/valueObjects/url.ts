import { z } from "zod"

const zValue = z.string().url()

/**
 * URL
 */
export class Url {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
