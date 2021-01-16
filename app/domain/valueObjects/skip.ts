import * as z from "zod"

export const skipSchema = z.number().min(0)

export type SkipValue = z.infer<typeof skipSchema>

export class Skip {
  constructor(public value: SkipValue) {
    skipSchema.parse(value)
    Object.freeze(this)
  }
}
