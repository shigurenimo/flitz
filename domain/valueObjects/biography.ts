import * as z from "zod"

export const biographySchema = z.string().max(80)

export type BiographyValue = z.infer<typeof biographySchema>

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
export class Biography {
  constructor(public value: BiographyValue) {
    biographySchema.parse(value)
    Object.freeze(this)
  }
}
