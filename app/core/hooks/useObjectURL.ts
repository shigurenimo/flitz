import { useUnmount } from "app/core/hooks/useUnmount"
import { useState } from "react"

export const useObjectURL = (object?: Blob) => {
  const [url] = useState(() => URL.createObjectURL(object))

  useUnmount(() => URL.revokeObjectURL(url))

  return url
}
