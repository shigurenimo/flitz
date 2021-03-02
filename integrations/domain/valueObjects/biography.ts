import * as z from "zod"

export const zBiography = z.string().max(80)

export type BiographyValue = z.infer<typeof zBiography>

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
    zBiography.parse(value)
    Object.freeze(this)
  }
}
