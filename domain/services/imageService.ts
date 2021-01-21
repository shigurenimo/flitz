import { Image } from "domain/valueObjects"
import sharp from "sharp"

export class ImageService {
  static async writeFile(image: Image, fileOut: string) {
    await sharp(image.value).resize({ width: 1024 }).png().toFile(fileOut)
  }

  static isInvalidContentType(fileType: string) {
    return (
      fileType !== "image/webp" &&
      fileType !== "image/png" &&
      fileType !== "image/jpeg"
    )
  }
}
