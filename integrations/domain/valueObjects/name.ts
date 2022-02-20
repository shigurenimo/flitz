import { z } from "zod"

const zValue = z.string().max(12)

/**
 * ユーザー名
 */
export class Name {
  readonly key = "NAME"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }

  /**
   * @deprecated
   * @param value
   * @returns
   */
  static nullable(value: z.infer<typeof zValue> | null) {
    return value === null ? null : new Name(value)
  }
}
