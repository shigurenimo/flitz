import * as z from "zod"

export const zTake = z.number().min(0).max(20)

export type TakeValue = z.infer<typeof zTake>

/**
 * 1ページの件数
 */
export class Take {
  constructor(public value: TakeValue = 8) {
    zTake.parse(value)
    Object.freeze(this)
  }
}
