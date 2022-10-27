import { z } from "zod"

const zValue = z.string().url()

/**
 * URL
 */
export class Url {
  readonly key = "URL"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
