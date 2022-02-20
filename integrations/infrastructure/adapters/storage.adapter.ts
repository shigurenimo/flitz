import admin from "firebase-admin"
import { Path } from "integrations/domain"
import { FirebaseAdapter } from "integrations/infrastructure/adapters/firebase.adapter"
import { tmpdir } from "os"
import { join } from "path"
import { injectable } from "tsyringe"

@injectable()
export class StorageAdapter {
  constructor(private firebaseRepository: FirebaseAdapter) {}

  async uploadToCloudStorage(filePath: Path) {
    this.firebaseRepository.initialize()

    const tmpPath = this.getFilePath(filePath)

    const bucket = admin.storage().bucket()

    await bucket.upload(tmpPath.value, {
      destination: filePath.value,
      metadata: { contentType: "image/png" },
    })

    return null
  }

  async downloadFileFromCloudStorage(filePath: Path) {
    this.firebaseRepository.initialize()

    const tmpPath = this.getFilePath(filePath)

    const bucket = admin.storage().bucket()

    return bucket.file(filePath.value).download({ destination: tmpPath.value })
  }

  createPath() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    let autoId = ""

    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return new Path(autoId)
  }

  private getFilePath(fileId: Path) {
    return new Path(join(tmpdir(), fileId.value))
  }
}
