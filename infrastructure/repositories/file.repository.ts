import { captureException } from "@sentry/node"
import { FileEntity } from "core"
import { FileType, Id, Path, Service } from "core/valueObjects"
import db from "db"

export class FileRepository {
  async upsert(file: FileEntity) {
    try {
      await db.file.create({
        data: {
          id: file.id.value,
          path: file.path.value,
          service: "CLOUD_STORAGE",
          type: "IMAGE_PNG",
          user: { connect: { id: file.userId.value } },
        },
      })

      return null
    } catch (error) {
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }

  async find(id: Id) {
    try {
      const file = await db.file.findUnique({
        where: { id: id.value },
      })

      if (file === null) {
        return null
      }

      return new FileEntity({
        id: new Id(file.id),
        path: new Path(file.path),
        type: new FileType(file.type),
        userId: new Id(file.userId),
        service: new Service(file.service),
      })
    } catch (error) {
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
