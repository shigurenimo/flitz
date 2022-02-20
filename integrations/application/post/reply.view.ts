import db from "db"
import { Id } from "integrations/domain"
import { ViewConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { injectable } from "tsyringe"

@injectable()
export class ReplyQuery {
  constructor(private queryConverter: ViewConverter) {}

  async count(input: { replyId: Id }) {
    const count = await db.post.count({
      where: { replyId: input.replyId.value },
    })

    return count
  }

  async findMany(input: {
    skip: number
    take: number
    replyId: Id
    userId: Id | null
  }) {
    const posts = await db.post.findMany({
      include: includeReplyPost(input.userId),
      orderBy: { createdAt: "desc" },
      skip: input.skip,
      take: input.take,
      where: { replyId: input.replyId.value },
    })

    return posts.map((post) => {
      return this.queryConverter.toQuotation(post)
    })
  }
}
