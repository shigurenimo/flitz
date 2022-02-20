import { useCallback, useEffect, useRef } from "react"

type props = {
  accept?: string
  multiple?: boolean
}

export const useFileSelect = (options?: props) => {
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    const input = document.createElement("input")
    input.type = "file"
    inputRef.current = input
  }, [])

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    input.accept = options?.accept || ""
    input.multiple = options?.multiple || false
  }, [options?.accept, options?.multiple])

  const select = useCallback(() => {
    const input = inputRef.current!

    input.value = ""

    return new Promise<File[]>((resolve) => {
      input.addEventListener(
        "change",
        () => resolve(Array.from(input.files || [])),
        { once: true }
      )
      input.click()
    })
  }, [])

  return select
}
