import { z } from "zod"

const zValue = z.string().max(128)

/**
 * 紹介文
 *
 * ユーザーの紹介文に使われる。
 *
 * - 文字列である
 * - 80文字まで
 *
 * @example
 * ```
 * const biography = new Biography("Hello")
 * ```
 */
export class ShortText {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
