import { useEffect, useState } from "react"

/**
 * ローカルのファイルを受け取ってURLを返す
 * @param file
 * @returns
 */
export const useFileURL = (file: File | null) => {
  const [fileURL, setFileURL] = useState<string | null>(null)

  useEffect(() => {
    if (file === null) {
      setFileURL(null)
      return
    }
    const fileURL = URL.createObjectURL(file)
    setFileURL(fileURL)
    return () => {
      URL.revokeObjectURL(fileURL)
    }
  }, [file])

  return [fileURL] as const
}
