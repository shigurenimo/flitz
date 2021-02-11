import type { Image, Path } from "integrations/domain/valueObjects"

export interface IImageRepository {
  getTmpPath(fileName: Path): Path

  writeImage(image: Image, filePath: Path): Promise<null>

  readImage(filePath: Path): Promise<Buffer>

  hasImage(filePath: Path): boolean
}
