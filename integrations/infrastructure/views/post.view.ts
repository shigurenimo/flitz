import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id } from "integrations/domain"
import { ViewConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { AppFeedPost } from "integrations/interface/types/appFeedPost"

@Injectable()
export class PostQuery {
  constructor(private queryConverter: ViewConverter) {}

  async count() {
    const count = await db.post.count()

    return new Count(count)
  }

  async find(id: Id, userId: Id | null): Promise<AppFeedPost | null> {
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
