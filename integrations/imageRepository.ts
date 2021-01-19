import sharp from "sharp"

export class ImageRepository {
  static async resize(path: string) {
    let image = sharp(path)

    await image.resize({ width: 1024 }).png().toFile("output.png")
  }
}
