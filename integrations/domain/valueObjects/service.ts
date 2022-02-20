import { Service as Enum } from "db"
import { z } from "zod"

const zValue = z
  .union([z.literal(Enum.AMAZON_S3), z.literal(Enum.CLOUD_STORAGE)])
  .nullable()

/**
 * サービス
 */
export class Service {
  readonly key = "SERVICE"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
