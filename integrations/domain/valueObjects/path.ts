import * as z from "zod"

export const pathSchema = z.string().max(160)

export type PathValue = z.infer<typeof pathSchema>

/**
 * パス
 */
export class Path {
  constructor(public value: PathValue) {
    pathSchema.parse(value)
    Object.freeze(this)
  }
}
