import { z } from "zod"

const zValue = z.string().email()
export type EmailValue = z.infer<typeof zValue>

/**
 * メールアドレス
 */
export class Email {
  readonly key = "EMAIL"

  /**
   * ```
   * const email = new Email("reiwa@outlook.com.vn")
   * ```
   *
   * @param value
   */
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    this.value = value.toLowerCase()
    Object.freeze(this)
  }
}
