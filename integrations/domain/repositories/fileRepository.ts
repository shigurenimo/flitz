// import { FileEntityFactory } from "domain/factories"
import type { File } from "db"
import type { FileEntity } from "integrations/domain/entities"
import type { FileType, Id, Service } from "integrations/domain/valueObjects"

export interface IFileRepository {
  createFile(input: {
    fileType: FileType
    path: Id
    service: Service | null
    userId: Id
  }): Promise<{
    file: File
    fileEntity: FileEntity
  }>

  getFile(input: {
    id: Id
  }): Promise<{
    file: File | null
    fileEntity: FileEntity | null
  }>
}
