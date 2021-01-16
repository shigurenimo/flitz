import * as z from "zod"

export const notificationCategorySchema = z.union([
  z.literal("FOLLOW"),
  z.literal("FRIENDSHIP"),
  z.literal("LIKE"),
  z.literal("QUOTATION"),
  z.literal("REPLY"),
])

export type NotificationCategoryValue = z.infer<
  typeof notificationCategorySchema
>

export class notificationType {
  constructor(public value: NotificationCategoryValue) {
    notificationCategorySchema.parse(value)
    Object.freeze(this)
  }
}
