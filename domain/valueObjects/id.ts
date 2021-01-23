import * as z from "zod"

export const idSchema = z.string().min(8).max(40)

export type IdValue = z.infer<typeof idSchema>

/**
 * ## ID
 */
export class Id {
  constructor(public value: IdValue) {
    idSchema.parse(value)
    Object.freeze(this)
  }

  /**
   * For nullable value
   * @param value
   * @returns
   */
  static nullable(value: IdValue | null) {
    return value === null ? null : new Id(value)
  }
}