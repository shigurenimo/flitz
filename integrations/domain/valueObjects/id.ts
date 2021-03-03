import * as z from "zod"

export const zId = z.string().min(8).max(40)

export type IdValue = z.infer<typeof zId>

/**
 * ID
 */
export class Id {
  constructor(public value: IdValue) {
    zId.parse(value)
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
