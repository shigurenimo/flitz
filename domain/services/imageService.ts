import sharp from "sharp"

export class ImageService {
  static async writeFile(path: string, fileOut: string) {
    let image = sharp(path)

    await image.resize({ width: 1024 }).png().toFile(fileOut)
  }

  static isInvalidContentType(fileType: string) {
    return (
      fileType !== "image/webp" &&
      fileType !== "image/png" &&
      fileType !== "image/jpeg"
    )
  }
}
