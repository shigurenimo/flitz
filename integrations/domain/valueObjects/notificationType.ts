import * as z from "zod"

export const zNotificationType = z.union([
  z.literal("FOLLOW"),
  z.literal("FRIENDSHIP"),
  z.literal("LIKE"),
  z.literal("QUOTATION"),
  z.literal("REPLY"),
])

export type NotificationTypeValue = z.infer<typeof zNotificationType>

/**
 * 通知の種類
 */
export class NotificationType {
  constructor(public value: NotificationTypeValue) {
    zNotificationType.parse(value)
    Object.freeze(this)
  }
}
