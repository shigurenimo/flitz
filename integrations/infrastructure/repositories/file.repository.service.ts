import { Injectable } from "@nestjs/common"
import db from "db"
import { FileEntity, FileRepository } from "integrations/domain"
import { FileType, Id, Path, Service } from "integrations/domain/valueObjects"

@Injectable()
export class FileRepositoryService extends FileRepository {
  async upsert(fileEntity: FileEntity) {
    await db.file.create({
      data: {
        id: fileEntity.id.value,
        path: fileEntity.path.value,
        service: "CLOUD_STORAGE",
        type: "IMAGE_PNG",
        user: { connect: { id: fileEntity.userId.value } },
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
