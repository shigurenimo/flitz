import { Count, Skip, Take, Username } from "domain/valueObjects"
import { Id } from "domain/valueObjects/id"
import db from "db"

/**
 * ## いいね評価
 */
export class LikeRepository {
  static async countLikes(input: { username: Username }) {
    const count = await db.like.count({
      where: { user: { username: input.username.value } },
    })

    return new Count(count)
  }

  static async getLikes(input: {
    userId: Id | null
    skip: Skip
    take: Take
    username: Username
  }) {
    return db.like.findMany({
      include: {
        post: {
          include: {
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotation: {
              include: {
                likes: input.userId
                  ? { where: { userId: input.userId.value } }
                  : false,
                quotations: input.userId
                  ? { where: { userId: input.userId.value } }
                  : false,
                replies: input.userId
                  ? { where: { userId: input.userId.value } }
                  : false,
                user: true,
              },
            },
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            reply: {
              include: {
                likes: input.userId
                  ? { where: { userId: input.userId.value } }
                  : false,
                quotations: input.userId
                  ? { where: { userId: input.userId.value } }
                  : false,
                replies: input.userId
                  ? { where: { userId: input.userId.value } }
                  : false,
                user: true,
              },
            },
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { user: { username: input.username.value } },
    })
  }
}
