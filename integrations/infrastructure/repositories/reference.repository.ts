import db from "db"
import { Id } from "integrations/domain/valueObjects"

export class ReferenceRepository {
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
