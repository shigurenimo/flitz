import { DownloadResponse } from "@google-cloud/storage"
import type { Id } from "integrations/domain/valueObjects"
import type { FirebaseRepository } from "integrations/infrastructure/repositories"

export interface IStorageRepository {
  firebaseRepository: FirebaseRepository

  uploadToCloudStorage(filePath: Id): Promise<null>

  downloadFileFromCloudStorage(filePath: Id): Promise<DownloadResponse>

  createPath(): Id
}
