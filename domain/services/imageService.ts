export class ImageService {
  static isInvalidContentType(fileType: string) {
    return (
      fileType !== "image/webp" &&
      fileType !== "image/png" &&
      fileType !== "image/jpeg"
    )
  }
}
