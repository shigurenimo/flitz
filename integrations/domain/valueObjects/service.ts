import { Service as Enum } from "db"
import * as z from "zod"

export const zService = z
  .union([z.literal(Enum.AMAZON_S3), z.literal(Enum.CLOUD_STORAGE)])
  .nullable()

export type ServiceValue = z.infer<typeof zService>

/**
 * サービス
 */
export class Service {
  constructor(public value: ServiceValue) {
    zService.parse(value)
    Object.freeze(this)
  }
}
