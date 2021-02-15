import db from "db"
import { Count, Id, Skip, Take, Username } from "integrations/domain"

export class UserFolloweerQuery {
  async count(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { followee: { username: input.username.value } },
    })

    return new Count(count)
  }

  async findByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
    const friendships = await db.friendship.findMany({
      include: {
        follower: {
          include: {
            followees: input.userId
              ? { where: { followeeId: input.userId.value } }
              : false,
            followers: input.userId
              ? { where: { followerId: input.userId.value } }
              : false,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { followee: { username: input.username.value } },
    })

    return friendships
  }
}
