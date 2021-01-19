import { Count, Id, Skip, Take, Username } from "domain/valueObjects"
import db from "db"

/**
 * ## フォローフォロワー関係
 */
export class FriendshipRepository {
  static async countUserFollowees(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { follower: { username: input.username.value } },
    })

    return new Count(count)
  }

  static async countUserFollowers(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { followee: { username: input.username.value } },
    })

    return new Count(count)
  }

  static getUserFollowers(input: { followeeId: Id }) {
    return db.friendship.findMany({
      where: { followeeId: input.followeeId.value },
      take: 20000,
    })
  }

  static async getUserFolloweesByUsername(input: {
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

  static async getUserFollowersByUsername(input: {
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
