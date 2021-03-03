/**
 * FileをBase64に変換する
 *
 * Upload images by base64 because blitz mutations does not accept Files
 * See https://github.com/blitz-js/blitz/issues/843
 */
export class ConvertFile {
  execute(file?: File | null): Promise<string | null> {
    if (!file) {
      return Promise.resolve(null)
    }

    const reader = new FileReader()

    return new Promise((resolve) => {
      reader.addEventListener(
        "loadend",
        () => resolve(reader.result as string),
        {
          once: true,
        }
      )
      reader.readAsDataURL(file)
    })
  }
}
