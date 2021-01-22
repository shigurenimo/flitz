import db from "db"
// import { FileEntityFactory } from "domain/factories"
import { FileType, Id, Service } from "domain/valueObjects"

export class FileRepository {
  static createFile(input: {
    fileType: FileType
    path: Id
    service: Service
    userId: Id
  }) {
    return db.file.create({
      data: {
        path: input.path.value,
        service: input.service.value,
        type: input.fileType.value,
        user: { connect: { id: input.userId.value } },
      },
    })
  }

  static async getFile(input: { id: Id }) {
    // const file = await db.file.findUnique({
    //   where: { id: input.id.value },
    // })

    // return FileEntityFactory.fromFile(file)

    return db.file.findUnique({
      where: { id: input.id.value },
    })
  }
}
