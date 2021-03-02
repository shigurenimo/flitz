import { Injectable } from "@nestjs/common"
import admin from "firebase-admin"
import { Id, Path } from "integrations/domain/valueObjects"
import { FirebaseAdapterService } from "integrations/infrastructure/adapters/firebase.adapter.service"
import { tmpdir } from "os"
import { join } from "path"

@Injectable()
export class StorageAdapterService {
  constructor(private firebaseRepository: FirebaseAdapterService) {}

  async uploadToCloudStorage(filePath: Id) {
    this.firebaseRepository.initialize()

    const tmpPath = this.getFilePath(filePath)

    const bucket = admin.storage().bucket()

    await bucket.upload(tmpPath.value, {
      destination: filePath.value,
      metadata: { contentType: "image/png" },
    })

    return null
  }

  async downloadFileFromCloudStorage(filePath: Id) {
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

    return new Id(autoId)
  }

  private getFilePath(fileId: Id) {
    return new Path(join(tmpdir(), fileId.value))
  }
}
