import db from "db"
import { ReferenceRepository } from "integrations/domain/repositories"
import { Id } from "integrations/domain/valueObjects"

export class ReferenceRepositoryService implements ReferenceRepository {
  async markAsRead(userId: Id) {
    await db.reference.updateMany({
      data: { isRead: true },
      where: {
        userId: userId.value,
        isRead: false,
      },
    })

    return null
  }
}
