import { useEffect, useRef } from "react"

export const useUnmount = (callback: () => void) => {
  const callbackRef = useRef<() => void>()

  callbackRef.current = callback

  useEffect(() => () => callbackRef.current!(), [])
}
