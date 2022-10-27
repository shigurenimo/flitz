import { useMutation } from "@tanstack/react-query"
import { getStorage, ref, uploadBytes } from "firebase/storage"

export const useCloudStorage = () => {
  const createId = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let text = ""
    for (let i = 0; i < 20; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return text
  }

  const asyncFunction = async (file: File | null) => {
    if (file === null) {
      return { fileId: null }
    }

    const fileId = createId()

    const storage = getStorage()

    const storageRef = ref(storage, fileId)

    await uploadBytes(storageRef, file)

    return { fileId }
  }

  const mutation = useMutation(asyncFunction)

  return [mutation.mutateAsync, mutation] as const
}
