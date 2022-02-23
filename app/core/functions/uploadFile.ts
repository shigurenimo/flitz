import { getStorage, ref, uploadBytes } from "firebase/storage"

export const uploadFile = async (file: File | null) => {
  const createId = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let text = ""
    for (let i = 0; i < 20; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return text
  }

  if (file === null) {
    return { fileId: null }
  }

  const fileId = createId()

  const storage = getStorage()

  const storageRef = ref(storage, fileId)

  await uploadBytes(storageRef, file)

  return { fileId }
}
