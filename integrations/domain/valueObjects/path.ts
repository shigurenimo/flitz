import * as z from "zod"

export const zPath = z.string().max(160)

export type PathValue = z.infer<typeof zPath>

/**
 * パス
 */
export class Path {
  constructor(public value: PathValue) {
    zPath.parse(value)
    Object.freeze(this)
  }
}
