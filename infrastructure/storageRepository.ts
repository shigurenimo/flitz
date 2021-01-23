import { Id, Path } from "domain/valueObjects"
import admin from "firebase-admin"
import { FirebaseRepository } from "infrastructure/firebaseRepository"
import { tmpdir } from "os"
import { join } from "path"

export class StorageRepository {
  static getFilePath(fileId: Id) {
    return new Path(join(tmpdir(), fileId.value))
  }

  static async uploadToCloudStorage(filePath: Id) {
    FirebaseRepository.initialize()

    const tmpPath = this.getFilePath(filePath)

    const bucket = admin.storage().bucket()

    await bucket.upload(tmpPath.value, {
      destination: filePath.value,
      metadata: { contentType: "image/png" },
    })
  }

  static async downloadFileFromCloudStorage(filePath: Id) {
    FirebaseRepository.initialize()

    const tmpPath = this.getFilePath(filePath)

    const bucket = admin.storage().bucket()

    return bucket.file(filePath.value).download({ destination: tmpPath.value })
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
