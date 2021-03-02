import * as z from "zod"

export const zSkip = z.number().min(0)

export type SkipValue = z.infer<typeof zSkip>

/**
 * スキップする件数
 */
export class Skip {
  constructor(public value: SkipValue) {
    zSkip.parse(value)
    Object.freeze(this)
  }
}
