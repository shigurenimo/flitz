import db from "db"
import { Id, Username } from "integrations/domain/valueObjects"
import { ViewConverter } from "integrations/infrastructure/converters"
import { includeEmbededPost } from "integrations/infrastructure/utils/includeEmbededPost"
import { AppFeedPost } from "integrations/interface/types/appFeedPost"
import { injectable } from "tsyringe"

@injectable()
export class UserLikeQuery {
  constructor(private prismaConverter: ViewConverter) {}

  async count(username: Username) {
    const count = await db.like.count({
      where: { user: { username: username.value } },
    })

    return count
  }

  async findMany(input: {
    userId: Id | null
    skip: number
    take: number
    username: Username
  }): Promise<AppFeedPost[]> {
    const likes = await db.like.findMany({
      include: {
        post: {
          include: {
            files: true,
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotation: { include: includeEmbededPost(input.userId) },
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            reply: { include: includeEmbededPost(input.userId) },
            user: { include: { iconImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip,
      take: input.take,
      where: { user: { username: input.username.value } },
    })

    return likes.map((like) => {
      return this.prismaConverter.toFeedPost(like.post)
    })
  }
}
