import { injectable } from "tsyringe"
import { z } from "zod"

@injectable()
export class EnvAdapter {
  /**
   * Firebase
   */
  get firebase() {
    const zProps = z.object({
      vapid: z.string(),
      apiKey: z.string(),
      authDomain: z.string(),
      projectId: z.string(),
      storageBucket: z.string(),
      messagingSenderId: z.string(),
      appId: z.string(),
      measurementId: z.string(),
      clientEmail: z.string(),
      privateKey: z.string().transform((text) => {
        return text.replace(/\\n/g, "\n").replace(/\\/g, "")
      }),
      databaseURL: z.string(),
    })

    return zProps.parse({
      vapid: process.env.NEXT_PUBLIC_FIREBASE_VAPID,
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    })
  }

  /**
   * Sentry
   */
  get sentry() {
    const zProps = z.object({
      dsn: z.string(),
      environment: z.string(),
    })

    return zProps.parse({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    })
  }

  /**
   * Sentryを使用するかどうか
   */
  get useSentry() {
    return process.env.NEXT_PUBLIC_USE_SENTRY === "true"
  }

  /**
   * Firebaseエミュレーターを使用するかどうか
   */
  get useFirebaseEmulator() {
    return process.env.NEXT_PUBLIC_USE_FIREBAE_EMULATOR === "true"
  }
}
