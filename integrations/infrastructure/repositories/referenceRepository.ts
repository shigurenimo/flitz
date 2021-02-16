import db from "db"
import { IReferenceRepository } from "integrations/domain/repositories"
import { Id } from "integrations/domain/valueObjects"

export class ReferenceRepository implements IReferenceRepository {
  async markReferencesAsRead(input: { userId: Id }) {
    await db.reference.updateMany({
      data: { isRead: true },
      where: {
        userId: input.userId.value,
        isRead: false,
      },
    })

    return null
  }
}
