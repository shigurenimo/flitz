import { Injectable } from "@nestjs/common"
import db from "db"
import { Id, Skip } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { QueryFeedPost } from "integrations/interface/types/queryFeedPost"

@Injectable()
export class LatestPostQuery {
  constructor(private queryConverter: QueryConverter) {}

  async findMany(input: {
    skip: Skip
    userId: Id | null
  }): Promise<QueryFeedPost[]> {
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
