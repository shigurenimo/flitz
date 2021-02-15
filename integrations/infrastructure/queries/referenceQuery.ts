import db from "db"
import { Count, Id, Skip } from "integrations/domain/valueObjects"
import { includeReplyPost } from "integrations/infrastructure/utils"

export class ReferenceQuery {
  async count(input: { userId: Id }) {
    const count = await db.post.count({ where: { userId: input.userId.value } })

    return new Count(count)
  }

  async hasUnread(input: { userId: Id }) {
    const reference = await db.reference.findFirst({
      where: {
        isRead: false,
        userId: input.userId.value,
      },
    })

    return reference !== null
  }

  async findMany(input: { skip: Skip; userId: Id }) {
    const references = await db.reference.findMany({
      include: {
        post: {
          include: {
            files: true,
            likes: { where: { userId: input.userId.value } },
            quotation: { include: includeReplyPost(input.userId) },
            quotations: { where: { userId: input.userId.value } },
            replies: { where: { userId: input.userId.value } },
            reply: { include: includeReplyPost(input.userId) },
            user: { include: { iconImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 16,
      where: { userId: input.userId.value },
    })

    return references
  }
}
