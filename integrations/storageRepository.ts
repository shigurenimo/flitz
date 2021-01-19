import admin from "firebase-admin"
import { FirebaseRepository } from "integrations/firebaseRepository"
import { tmpdir } from "os"
import { join } from "path"

export class StorageRepository {
  static toTmpPath(fileName: string) {
    return join(tmpdir(), fileName)
  }

  static async upload(filePath: string) {
    const destination = FirebaseRepository.createId()

    const bucket = admin.storage().bucket()

    await bucket.upload(filePath, {
      destination,
      metadata: { contentType: "image/png" },
    })
  }
}
