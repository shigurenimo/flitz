import { Count, Id, Skip, Take, Username } from "app/domain/valueObjects"
import db from "db"

export class FriendshipRepository {
  static async countFollowees(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { follower: { username: input.username.value } },
    })

    return new Count(count)
  }

  static async countFollowers(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { followee: { username: input.username.value } },
    })

    return new Count(count)
  }

  static getFollowers(input: { followeeId: Id }) {
    return db.friendship.findMany({
      where: { followeeId: input.followeeId.value },
      take: 20000,
    })
  }

  static async getFolloweesByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
    return db.friendship.findMany({
      include: {
        followee: {
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
      where: { follower: { username: input.username.value } },
    })
  }

  static async getFollowersByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
    return db.friendship.findMany({
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
  }
}
