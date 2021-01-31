import db from "db"
import { IReferenceRepository } from "domain/repositories"
import { Count, Id, Skip } from "domain/valueObjects"
import { PrismaAdapter } from "infrastructure/adapters"
import { includeReplyPost } from "infrastructure/repositories/utils"

export class ReferenceRepository implements IReferenceRepository {
  async countReferences(input: { userId: Id }) {
    const count = await db.post.count({ where: { userId: input.userId.value } })

    return new Count(count)
  }

  async hasUnreadReference(input: { userId: Id }) {
    const reference = await db.reference.findFirst({
      where: {
        isRead: false,
        userId: input.userId.value,
      },
    })

    return reference !== null
  }

  async findReferences(input: { skip: Skip; userId: Id }) {
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

    const referenceEntities = references.map((reference) => {
      return new PrismaAdapter().toReferenceEntity(reference)
    })

    return { references, referenceEntities }
  }

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
