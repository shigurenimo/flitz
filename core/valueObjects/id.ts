import { z } from "zod"

const zValue = z.union([z.string().length(21), z.string().length(20)])

/**
 * ID
 */
export class Id {
  readonly key = "ID"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
