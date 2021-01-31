import db from "db"
import { ILikeRepository } from "domain/repositories"
import { Count, Id, Skip, Take, Username } from "domain/valueObjects"
import { PrismaAdapter } from "infrastructure/adapters"
import { includeEmbededPost } from "infrastructure/repositories/utils"

export class LikeRepository implements ILikeRepository {
  async countLikes(input: { username: Username }) {
    const count = await db.like.count({
      where: { user: { username: input.username.value } },
    })

    return new Count(count)
  }

  async getLikes(input: {
    userId: Id | null
    skip: Skip
    take: Take
    username: Username
  }) {
    const likes = await db.like.findMany({
      include: {
        post: {
          include: {
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
      skip: input.skip.value,
      take: input.take.value,
      where: { user: { username: input.username.value } },
    })

    const likeEntities = likes.map((like) => {
      return new PrismaAdapter().toLikeEntity(like)
    })

    return { likes, likeEntities }
  }
}
