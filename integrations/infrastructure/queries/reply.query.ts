import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id, Skip, Take } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"

@Injectable()
export class ReplyQuery {
  constructor(private queryConverter: QueryConverter) {}

  async count(input: { replyId: Id }) {
    const count = await db.post.count({
      where: { replyId: input.replyId.value },
    })

    return new Count(count)
  }

  async findMany(input: {
    skip: Skip
    take: Take
    replyId: Id
    userId: Id | null
  }) {
    const posts = await db.post.findMany({
      include: includeReplyPost(input.userId),
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { replyId: input.replyId.value },
    })

    return posts.map((post) => {
      return this.queryConverter.toQuotation(post)
    })
  }
}
