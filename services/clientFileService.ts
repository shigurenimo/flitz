export class ClientFileService {
  static convertFileToBase64 = (file?: File | null): Promise<string | null> => {
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
