import { captureException } from "@sentry/node"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { EnvAdapter } from "integrations/infrastructure/adapters/env.adapter"
import { injectable } from "tsyringe"

@injectable()
export class FirebaseAdapter {
  constructor(private envAdapter: EnvAdapter) {}

  initialize() {
    try {
      if (0 < getApps().length) return null

      if (this.envAdapter.useFirebaseEmulator) {
        initializeApp({})

        return null
      }
      initializeApp({
        credential: cert({
          clientEmail: this.envAdapter.firebase.clientEmail,
          privateKey: this.envAdapter.firebase.privateKey,
          projectId: this.envAdapter.firebase.projectId,
        }),
        databaseURL: this.envAdapter.firebase.databaseURL,
        storageBucket: this.envAdapter.firebase.storageBucket,
      })

      return null
    } catch (error) {
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
