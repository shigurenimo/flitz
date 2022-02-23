import { captureException, Severity } from "@sentry/node"
import admin from "firebase-admin"
import { EnvAdapter } from "integrations/infrastructure/adapters/env.adapter"
import { injectable } from "tsyringe"

@injectable()
export class FirebaseAdapter {
  constructor(private envAdapter: EnvAdapter) {}

  initialize() {
    try {
      if (0 < admin.apps.length) return null

      if (this.envAdapter.useFirebaseEmulator) {
        admin.initializeApp({})

        return null
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail: this.envAdapter.firebase.clientEmail,
          privateKey: this.envAdapter.firebase.privateKey,
          projectId: this.envAdapter.firebase.projectId,
        }),
        databaseURL: this.envAdapter.firebase.databaseURL,
        storageBucket: this.envAdapter.firebase.storageBucket,
      })

      return null
    } catch (error) {
      captureException(error, { level: Severity.Fatal })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
