import { z } from "zod"

const zValue = z.union([
  z.literal("FOLLOW"),
  z.literal("FRIENDSHIP"),
  z.literal("LIKE"),
  z.literal("QUOTATION"),
  z.literal("REPLY"),
])

/**
 * 通知の種類
 */
export class NotificationType {
  readonly key = "NOTIFICATION_TYPE"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
