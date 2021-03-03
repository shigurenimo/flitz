import * as z from "zod"

export const zCount = z.number().min(0)

export type CountValue = z.infer<typeof zCount>

/**
 * 集計した値
 *
 * - 数字である
 * - 0以上
 */
export class Count {
  constructor(public value: CountValue) {
    zCount.parse(value)
    Object.freeze(this)
  }
}
