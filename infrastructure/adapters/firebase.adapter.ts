import { cert, getApps, initializeApp } from "firebase-admin/app"
import { injectable } from "tsyringe"
import { EnvAdapter } from "infrastructure/adapters/env.adapter"
import { throwError } from "infrastructure/utils"

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
      return throwError(error)
    }
  }
}
