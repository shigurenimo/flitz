import { Id } from "domain/valueObjects"
import admin from "firebase-admin"
import { FirebaseRepository } from "infrastructure/firebaseRepository"
import { tmpdir } from "os"
import { join } from "path"

export class StorageRepository {
  static toTmpPath(fileName: Id) {
    return join(tmpdir(), fileName.value)
  }

  static async uploadToCloudStorage(filePath: string) {
    const destination = FirebaseRepository.createId()

    const bucket = admin.storage().bucket()

    await bucket.upload(filePath, {
      destination: destination.value,
      metadata: { contentType: "image/png" },
    })
  }
}
