import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { ViewConverter } from "integrations/infrastructure/converters/view.converter"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { AppFeed } from "integrations/interface/types/appFeed"
import { injectable } from "tsyringe"

@injectable()
export class ReferenceQuery {
  constructor(private queryConverter: ViewConverter) {}

  async count(userId: Id) {
    const count = await db.post.count({ where: { userId: userId.value } })

    return count
  }

  async hasUnread(userId: Id) {
    const reference = await db.reference.findFirst({
      where: {
        isRead: false,
        userId: userId.value,
      },
    })

    return reference !== null
  }

  async findMany(input: { skip: number; userId: Id }): Promise<AppFeed[]> {
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
      skip: input.skip,
      take: 16,
      where: { userId: input.userId.value },
    })

    return references.map((reference) => {
      return this.queryConverter.toFeed(reference)
    })
  }
}
