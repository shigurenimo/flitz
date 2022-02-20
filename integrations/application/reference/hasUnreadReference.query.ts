import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

@injectable()
export class HasUnreadReferenceQuery {
  async execute(userId: Id) {
    const reference = await db.reference.findFirst({
      where: {
        isRead: false,
        userId: userId.value,
      },
    })

    return reference !== null
  }
}
