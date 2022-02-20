import { FileType as Enum } from "db"
import { z } from "zod"

const zValue = z.union([
  z.literal(Enum.IMAGE_GIF),
  z.literal(Enum.IMAGE_JPEG),
  z.literal(Enum.IMAGE_PNG),
  z.literal(Enum.IMAGE_WEBP),
])

/**
 * ファイルタイプ
 */
export class FileType {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
