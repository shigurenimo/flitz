import * as z from "zod"

export class EnvRepository {
  static isFirebaseProject() {
    const { success } = z
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

    return success
  }
}
