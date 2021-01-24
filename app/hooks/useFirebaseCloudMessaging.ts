import { useToast } from "@chakra-ui/react"
import firebase from "firebase/app"
import { useEffect } from "react"

export const useFirebaseCloudMessaging = () => {
  const toast = useToast()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_VAPID) return

    if (typeof window === "undefined") return

    if (firebase.apps.length < 1) return

    if (!firebase.messaging.isSupported()) return

    const messaging = firebase.messaging()

    const unsubscribe = messaging.onMessage((payload) => {
      toast({
        status: "info",
        title: payload.notification.title,
        description: payload.notification.body,
      })
    })

    return () => unsubscribe()
  }, [toast])
}
