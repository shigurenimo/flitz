import { tmpdir } from "os"
import { join } from "path"
import { captureException } from "@sentry/node"
import { getStorage } from "firebase-admin/storage"
import { injectable } from "tsyringe"
import { Path } from "core"
import { FirebaseAdapter } from "infrastructure/adapters/firebase.adapter"

@injectable()
export class StorageAdapter {
  constructor(private firebaseAdapter: FirebaseAdapter) {}

  async downloadFile(filePath: Path) {
    try {
      this.firebaseAdapter.initialize()

      const tmpPath = this.getFilePath(filePath)

      const bucket = getStorage().bucket()

      return bucket
        .file(filePath.value)
        .download({ destination: tmpPath.value })
    } catch (error) {
      captureException(error, { level: "fatal" })
      if (error instanceof Error) {
        return new Error(error.message)
      }
      return new Error()
    }
  }

  private getFilePath(fileId: Path) {
    return new Path(join(tmpdir(), fileId.value))
  }
}
