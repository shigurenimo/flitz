import { IImageRepository } from "domain/repositories"
import { Image, Path } from "domain/valueObjects"
import fs from "fs"
import { tmpdir } from "os"
import { join } from "path"
import sharp from "sharp"

export class ImageRepository implements IImageRepository {
  getTmpPath(fileName: Path) {
    return new Path(join(tmpdir(), fileName.value))
  }

  async writeImage(image: Image, filePath: Path) {
    const tmpPath = this.getTmpPath(filePath)

    await sharp(image.value).resize({ width: 1024 }).png().toFile(tmpPath.value)

    return null
  }

  async readImage(filePath: Path) {
    const tmpPath = this.getTmpPath(filePath)

    return sharp(tmpPath.value).toBuffer()
  }

  hasImage(filePath: Path) {
    const tmpPath = this.getTmpPath(filePath)

    return fs.existsSync(tmpPath.value)
  }
}
