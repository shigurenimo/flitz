import * as z from "zod"

export const notificationTypeSchema = z.union([
  z.literal("FOLLOW"),
  z.literal("FRIENDSHIP"),
  z.literal("LIKE"),
  z.literal("QUOTATION"),
  z.literal("REPLY"),
])

export type NotificationTypeValue = z.infer<typeof notificationTypeSchema>

export class notificationType {
  constructor(public value: NotificationTypeValue) {
    notificationTypeSchema.parse(value)
    Object.freeze(this)
  }
}
