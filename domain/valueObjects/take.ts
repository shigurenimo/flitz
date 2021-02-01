import * as z from "zod"

export const takeSchema = z.number().min(0).max(20)

export type TakeValue = z.infer<typeof takeSchema>

/**
 * 1ページの件数
 */
export class Take {
  constructor(public value: TakeValue = 8) {
    takeSchema.parse(value)
    Object.freeze(this)
  }
}
