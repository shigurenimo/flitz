import { Injectable } from "@nestjs/common"
import db from "db"
import { Id, Skip } from "integrations/domain"
import { ViewConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { AppFeedPost } from "integrations/interface/types/appFeedPost"

@Injectable()
export class LatestPostQuery {
  constructor(private queryConverter: ViewConverter) {}

  async findMany(input: {
    skip: Skip
    userId: Id | null
  }): Promise<AppFeedPost[]> {
    const posts = await db.post.findMany({
      include: {
        files: true,
        likes: input.userId ? { where: { userId: input.userId.value } } : false,
        quotation: { include: includeReplyPost(input.userId) },
        quotations: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        replies: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        reply: { include: includeReplyPost(input.userId) },
        user: { include: { iconImage: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 16,
    })

    return posts.map((post) => {
      return this.queryConverter.toFeedPost(post)
    })
  }
}
