import db from "db"
import { FileEntity } from "integrations/domain"
import { FileType, Id, Path, Service } from "integrations/domain/valueObjects"

export class FileRepository {
  async upsert(file: FileEntity) {
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
  }

  async find(id: Id) {
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
  }
}
