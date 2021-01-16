import * as z from "zod"

export const urlSchema = z.string().url()

export type UrlValue = z.infer<typeof urlSchema>

export class Url {
  constructor(public value: UrlValue) {
    urlSchema.parse(value)
    Object.freeze(this)
  }
}
