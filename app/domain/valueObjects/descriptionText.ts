import * as z from "zod"

export const biographySchema = z.string().max(80)

export type BiographyValue = z.infer<typeof biographySchema>

export class Biography {
  constructor(public value: BiographyValue) {
    biographySchema.parse(value)
    Object.freeze(this)
  }
}
