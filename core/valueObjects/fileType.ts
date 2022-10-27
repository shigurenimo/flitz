import { z } from "zod"
import { FileType as Enum } from "db"

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
  readonly key = "FILE_TYPE"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
