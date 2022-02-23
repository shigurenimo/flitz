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

  private getFilePath(fileId: Path) {
    return new Path(join(tmpdir(), fileId.value))
  }
}
