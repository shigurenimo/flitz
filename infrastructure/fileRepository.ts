import db from "db"
import { FileType, Id, Service } from "domain/valueObjects"

export class FileRepository {
  static createFile = (input: {
    fileType: FileType
    path: Id
    service: Service
    userId: Id
  }) => {
    return db.file.create({
      data: {
        path: input.path.value,
        service: input.service.value,
        type: input.fileType.value,
        user: { connect: { id: input.userId.value } },
      },
    })
  }

  static getFile = (input: { id: Id }) => {
    return db.file.findUnique({
      where: { id: input.id.value },
    })
  }
}
