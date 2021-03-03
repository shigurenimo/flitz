import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id, Skip } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters/queryConverter"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { QueryFeed } from "integrations/interface/types/queryFeed"

@Injectable()
export class ReferenceQuery {
  constructor(private queryConverter: QueryConverter) {}

  async count(userId: Id) {
    const count = await db.post.count({ where: { userId: userId.value } })

    return new Count(count)
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

  async findMany(input: { skip: Skip; userId: Id }): Promise<QueryFeed[]> {
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

    return references.map((reference) => {
      return this.queryConverter.toFeed(reference)
    })
  }
}
