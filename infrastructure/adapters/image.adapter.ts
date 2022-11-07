import { tmpdir } from "os"
import { join } from "path"
import sharp from "sharp"
import { Image, Path } from "core/valueObjects"
import { throwError } from "infrastructure/utils"

export class ImageAdapter {
  private getTmpPath(fileName: Path) {
    return new Path(join(tmpdir(), fileName.value))
  }

  /**
   * 画像データを書き込む
   * @param image
   * @param filePath
   * @returns
   */
  async writeImage(image: Image, filePath: Path) {
    try {
      const tmpPath = this.getTmpPath(filePath)

      await sharp(image.value)
        .resize({ width: 1024 })
        .png()
        .toFile(tmpPath.value)

      return null
    } catch (error) {
      return throwError(error)
    }
  }

  /**
   * 画像データを読み取る
   * @param filePath
   * @returns
   */
  async readImage(filePath: Path) {
    try {
      const tmpPath = this.getTmpPath(filePath)

      return sharp(tmpPath.value).toBuffer()
    } catch (error) {
      return throwError(error)
    }
  }
}
