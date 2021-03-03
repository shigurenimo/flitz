import * as z from "zod"

export const zUrl = z.string().url()

export type UrlValue = z.infer<typeof zUrl>

/**
 * URL
 */
export class Url {
  constructor(public value: UrlValue) {
    zUrl.parse(value)
    Object.freeze(this)
  }
}
