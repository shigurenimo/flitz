import { useClipboard, useToast } from "@chakra-ui/react"
import { useEffect } from "react"

export const useClipboardAndToast = (text: string) => {
  const toast = useToast()

  const { hasCopied, onCopy } = useClipboard(text)

  useEffect(() => {
    if (hasCopied) toast({ description: "Copied to clipboard" })
  }, [hasCopied, toast])

  return onCopy
}
