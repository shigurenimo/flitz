import * as z from "zod"

export const zEmail = z.string().email()

export type EmailValue = z.infer<typeof zEmail>

/**
 * メールアドレス
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
    zEmail.parse(value)
    this.value = value.toLowerCase()
    Object.freeze(this)
  }
}
