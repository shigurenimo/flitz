import firebase from "firebase/app"
import "firebase/messaging"
import { useEffect } from "react"

export const useFirebase = async () => {
  useEffect(() => {
    if (typeof window === "undefined") return

    if (!process.env.NEXT_PUBLIC_API_KEY) return

    if (0 < firebase.apps.length) return

    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    })
  }, [])
}
