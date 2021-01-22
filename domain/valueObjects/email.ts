import * as z from "zod"

export const emailSchema = z.string().email()

export type EmailValue = z.infer<typeof emailSchema>

/**
 * ## メールアドレス
 */
export class Email {
  /**
   * ```
   * const email = new Email("reiwa@outlook.com.vn")
   * ```
   *
   * @param value
   */
  constructor(public value: EmailValue) {
    emailSchema.parse(value)
    this.value = value.toLowerCase()
    Object.freeze(this)
  }
}
