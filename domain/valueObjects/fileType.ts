import { FileType as Enum } from "db"
import * as z from "zod"

export const fileTypeSchema = z.union([
  z.literal(Enum.IMAGE_GIF),
  z.literal(Enum.IMAGE_JPEG),
  z.literal(Enum.IMAGE_PNG),
  z.literal(Enum.IMAGE_WEBP),
])

export type FileTypeValue = z.infer<typeof fileTypeSchema>

/**
 * ## ファイルタイプ
 */
export class FileType {
  constructor(public value: FileTypeValue) {
    fileTypeSchema.parse(value)
    Object.freeze(this)
  }
}
