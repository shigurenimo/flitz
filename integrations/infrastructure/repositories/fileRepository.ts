import db from "db"
import { IFileRepository } from "integrations/domain/repositories"
import { FileType, Id, Service } from "integrations/domain/valueObjects"
import { PrismaAdapter } from "integrations/infrastructure/adapters"

export class FileRepository implements IFileRepository {
  prismaAdapter: PrismaAdapter

  constructor() {
    this.prismaAdapter = new PrismaAdapter()
  }

  async createFile(input: {
    fileType: FileType
    path: Id
    service: Service | null
    userId: Id
  }) {
    const file = await db.file.create({
      data: {
        path: input.path.value,
        service: input.service ? input.service.value : undefined,
        type: input.fileType.value,
        user: { connect: { id: input.userId.value } },
      },
    })

    const fileEntity = this.prismaAdapter.toFileEntity(file)

    return { file, fileEntity }
  }

  async getFile(input: { id: Id }) {
    const file = await db.file.findUnique({
      where: { id: input.id.value },
    })

    const fileEntity = this.prismaAdapter.toFileEntity(file)

    return { file, fileEntity }
  }
}
