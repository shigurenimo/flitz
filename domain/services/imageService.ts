import { Id, Image } from "domain/valueObjects"
import { tmpdir } from "os"
import { join } from "path"
import sharp from "sharp"

export class ImageService {
  static getFilePath(fileName: Id) {
    return join(tmpdir(), fileName.value)
  }

  static async writeFile(image: Image, fileId: Id) {
    const filePath = this.getFilePath(fileId)

    await sharp(image.value).resize({ width: 1024 }).png().toFile(filePath)
  }

  static isInvalidContentType(fileType: string) {
    return (
      fileType !== "image/webp" &&
      fileType !== "image/png" &&
      fileType !== "image/jpeg"
    )
  }
}
