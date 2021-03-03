import { FileType as Enum } from "db"
import * as z from "zod"

export const zFileType = z.union([
  z.literal(Enum.IMAGE_GIF),
  z.literal(Enum.IMAGE_JPEG),
  z.literal(Enum.IMAGE_PNG),
  z.literal(Enum.IMAGE_WEBP),
])

export type FileTypeValue = z.infer<typeof zFileType>

/**
 * ファイルタイプ
 */
export class FileType {
  constructor(public value: FileTypeValue) {
    zFileType.parse(value)
    Object.freeze(this)
  }
}
