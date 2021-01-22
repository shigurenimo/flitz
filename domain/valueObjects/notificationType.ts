import * as z from "zod"

export const notificationTypeSchema = z.union([
  z.literal("FOLLOW"),
  z.literal("FRIENDSHIP"),
  z.literal("LIKE"),
  z.literal("QUOTATION"),
  z.literal("REPLY"),
])

export type NotificationTypeValue = z.infer<typeof notificationTypeSchema>

/**
 * ## 通知の種類
 */
export class NotificationType {
  constructor(public value: NotificationTypeValue) {
    notificationTypeSchema.parse(value)
    Object.freeze(this)
  }
}
