import db from "db"
import { FileType, Id, Service } from "domain/valueObjects"

export class FileRepository {
  static createFile = (input: {
    fileType: FileType
    path: string
    service: Service
    userId: Id
  }) => {
    return db.file.create({
      data: {
        path: input.path,
        service: input.service.value,
        type: input.fileType.value,
        user: { connect: { id: input.userId.value } },
      },
    })
  }
}
