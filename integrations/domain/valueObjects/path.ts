import { z } from "zod"

const zValue = z.string().max(160)

/**
 * パス
 */
export class Path {
  readonly key = "PATH"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
