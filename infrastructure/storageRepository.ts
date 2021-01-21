import { Id } from "domain/valueObjects"
import admin from "firebase-admin"
import { FirebaseRepository } from "infrastructure/firebaseRepository"
import { tmpdir } from "os"
import { join } from "path"

export class StorageRepository {
  static getFilePath(fileName: Id) {
    return join(tmpdir(), fileName.value)
  }

  static async uploadToCloudStorage(filePath: Id) {
    FirebaseRepository.initialize()

    const tmpFilePath = this.getFilePath(filePath)

    const bucket = admin.storage().bucket()

    await bucket.upload(tmpFilePath, {
      destination: filePath.value,
      metadata: { contentType: "image/png" },
    })
  }

  static createPath() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    let autoId = ""

    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return new Id(autoId)
  }
}
