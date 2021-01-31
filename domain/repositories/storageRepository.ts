import { DownloadResponse } from "@google-cloud/storage"
import type { Id, Path } from "domain/valueObjects"
import type { FirebaseRepository } from "infrastructure/repositories"

export interface IStorageRepository {
  firebaseRepository: FirebaseRepository

  getFilePath(fileId: Id): Path

  uploadToCloudStorage(filePath: Id): Promise<null>

  downloadFileFromCloudStorage(filePath: Id): Promise<DownloadResponse>

  createPath(): Id
}
