import { useToast } from "@chakra-ui/react"
import { getApps } from "firebase/app"
import {
  getMessaging,
  isSupported,
  onMessage,
  Unsubscribe,
} from "firebase/messaging"
import { useEffect } from "react"

export const useFirebaseCloudMessaging = () => {
  const toast = useToast()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID) return

    if (typeof window === "undefined") return

    if (getApps().length < 1) return

    let unsubscribe: Unsubscribe | null = null

    const messaging = getMessaging()

    isSupported().then((isSupportedSync) => {
      if (!isSupportedSync) return

      unsubscribe = onMessage(messaging, (payload) => {
        toast({
          status: "info",
          title: payload.notification?.title,
          description: payload.notification?.body,
        })
      })
    })

    return () => {
      if (unsubscribe === null) return
      unsubscribe()
    }
  }, [toast])
}
