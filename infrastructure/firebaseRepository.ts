import { Id } from "domain/valueObjects"
import admin from "firebase-admin"
import * as z from "zod"

export class FirebaseRepository {
  /**
   * SDKを初期化する
   * https://firebase.google.com/docs/admin/setup?hl=ja#initialize-sdk
   */
  static initialize() {
    if (admin.apps.length > 0) return

    const { projectId, clientEmail, privateKey } = z
      .object({
        projectId: z.string(),
        clientEmail: z.string().email(),
        privateKey: z.string(),
      })
      .parse({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      })

    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n").replace(/\\/g, ""),
        projectId,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
      storageBucket: `${projectId}.appspot.com`,
    })
  }

  static createId() {
    return new Id(admin.firestore().collection("collectionPath").doc().id)
  }
}
