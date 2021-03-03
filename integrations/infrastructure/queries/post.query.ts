import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { QueryFeedPost } from "integrations/interface/types/queryFeedPost"

@Injectable()
export class PostQuery {
  constructor(private queryConverter: QueryConverter) {}

  async count() {
    const count = await db.post.count()

    return new Count(count)
  }

  async find(id: Id, userId: Id | null): Promise<QueryFeedPost | null> {
    const post = await db.post.findUnique({
      include: {
        files: true,
        likes: userId ? { where: { userId: userId.value } } : false,
        quotation: { include: includeReplyPost(userId) },
        quotations: userId ? { where: { userId: userId.value } } : false,
        replies: userId ? { where: { userId: userId.value } } : false,
        reply: { include: includeReplyPost(userId) },
        user: { include: { iconImage: true } },
      },
      where: { id: id.value },
    })

    if (post === null) {
      return null
    }

    return this.queryConverter.toFeedPost(post)
  }
}
