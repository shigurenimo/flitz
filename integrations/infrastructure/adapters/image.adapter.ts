import { captureException } from "@sentry/node"
import { Image, Path } from "integrations/domain/valueObjects"
import { tmpdir } from "os"
import { join } from "path"
import sharp from "sharp"

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
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
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
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
