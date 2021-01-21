import * as z from "zod"

export class EnvRepository {
  static getFirebaseEnv() {
    const result = z
      .object({
        projectId: z.string(),
        clientEmail: z.string().email(),
        privateKey: z.string(),
      })
      .safeParse({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      })

    if (!result.success) {
      return null
    }

    return result.data
  }

  static isFirebaseProject() {
    const config = this.getFirebaseEnv()

    return config !== null
  }

  static isLocalProject() {
    return !this.isFirebaseProject()
  }
}
