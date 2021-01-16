import { Count, Id, Skip } from "app/domain/valueObjects"
import db from "db"

export class ReferenceRepository {
  static async countReferences(input: { userId: Id }) {
    const count = await db.post.count({ where: { userId: input.userId.value } })

    return new Count(count)
  }

  static async hasUnreadReference(input: { userId: Id }) {
    const reference = await db.reference.findFirst({
      where: {
        isRead: false,
        userId: input.userId.value,
      },
    })

    return reference !== null
  }

  static findReferences(input: { skip: Skip; userId: Id }) {
    return db.reference.findMany({
      include: {
        post: {
          include: {
            likes: { where: { userId: input.userId.value } },
            quotation: {
              include: {
                likes: { where: { userId: input.userId.value } },
                quotations: { where: { userId: input.userId.value } },
                replies: { where: { userId: input.userId.value } },
                user: true,
              },
            },
            quotations: { where: { userId: input.userId.value } },
            replies: { where: { userId: input.userId.value } },
            reply: {
              include: {
                likes: { where: { userId: input.userId.value } },
                quotations: { where: { userId: input.userId.value } },
                replies: { where: { userId: input.userId.value } },
                user: true,
              },
            },
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 16,
      where: { userId: input.userId.value },
    })
  }

  static markReferencesAsRead(input: { userId: Id }) {
    return db.reference.updateMany({
      data: { isRead: true },
      where: {
        userId: input.userId.value,
        isRead: false,
      },
    })
  }
}
