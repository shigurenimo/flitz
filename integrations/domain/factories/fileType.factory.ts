import { FileType } from "integrations/domain/valueObjects"

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
