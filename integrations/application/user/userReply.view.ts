import db from "db"
import { Id, Username } from "integrations/domain/valueObjects"
import { ViewConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { injectable } from "tsyringe"

@injectable()
export class UserReplyQuery {
  constructor(private queryConverter: ViewConverter) {}

  async count(username: Username) {
    const count = await db.post.count({
      where: {
        user: { username: username.value },
        replyId: { not: null },
      },
    })

    return count
  }

  async findMany(input: {
    skip: number
    take: number
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
      skip: input.skip,
      take: input.take,
      where: {
        user: { username: input.username.value },
        replyId: { not: null },
      },
    })

    return posts.map((post) => {
      return this.queryConverter.toFeedPost(post)
    })
  }
}
