import { captureException, Severity } from "@sentry/node"
import admin from "firebase-admin"
import { Path } from "integrations/domain"
import { FirebaseAdapter } from "integrations/infrastructure/adapters/firebase.adapter"
import { tmpdir } from "os"
import { join } from "path"
import { injectable } from "tsyringe"

@injectable()
export class StorageAdapter {
  constructor(private firebaseAdapter: FirebaseAdapter) {}

  async downloadFile(filePath: Path) {
    try {
      this.firebaseAdapter.initialize()

      const tmpPath = this.getFilePath(filePath)

      const bucket = admin.storage().bucket()

      return bucket
        .file(filePath.value)
        .download({ destination: tmpPath.value })
    } catch (error) {
      captureException(error, { level: Severity.Fatal })

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
