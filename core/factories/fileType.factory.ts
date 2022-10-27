import { FileType } from "core/valueObjects"

export class FileTypeFactory {
  static gif() {
    return new FileType("IMAGE_GIF")
  }

  static png() {
    return new FileType("IMAGE_PNG")
  }

  static jpeg() {
    return new FileType("IMAGE_JPEG")
  }
}
