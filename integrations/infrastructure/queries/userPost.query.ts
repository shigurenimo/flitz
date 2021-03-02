import { Injectable } from "@nestjs/common"
import db from "db"
import {
  Count,
  Id,
  Skip,
  Take,
  Username,
} from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"

@Injectable()
export class UserPostQuery {
  constructor(private queryConverter: QueryConverter) {}

  async count(input: { username: Username }) {
    const count = await db.post.count({
      where: { user: { username: input.username.value } },
    })

    return new Count(count)
  }

  async findMany(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
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
      take: input.take.value,
      where: { user: { username: input.username.value } },
    })

    return posts.map((post) => {
      return this.queryConverter.toFeedPost(post)
    })
  }
}
