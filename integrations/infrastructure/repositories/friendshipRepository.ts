import db from "db"
import { IFriendshipRepository } from "integrations/domain/repositories"
import { Count, Id, Skip, Take, Username } from "integrations/domain/valueObjects"
import { PrismaAdapter } from "integrations/infrastructure/adapters/prismaAdapter"

export class FriendshipRepository implements IFriendshipRepository {
  async countUserFollowees(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { follower: { username: input.username.value } },
    })

    return new Count(count)
  }

  async countUserFollowers(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { followee: { username: input.username.value } },
    })

    return new Count(count)
  }

  async getUserFollowers(input: { followeeId: Id }) {
    const friendships = await db.friendship.findMany({
      where: { followeeId: input.followeeId.value },
      take: 20000,
    })

    const friendshipEntities = friendships.map((friendship) => {
      return new PrismaAdapter().toFriendshipEntity(friendship)
    })

    return { friendships, friendshipEntities }
  }

  async getUserFolloweesByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
    const friendships = await db.friendship.findMany({
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

    const friendshipEntities = friendships.map((friendship) => {
      return new PrismaAdapter().toFriendshipEntity(friendship)
    })

    return { friendships, friendshipEntities }
  }

  async getUserFollowersByUsername(input: {
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

    const friendshipEntities = friendships.map((friendship) => {
      return new PrismaAdapter().toFriendshipEntity(friendship)
    })

    return { friendships, friendshipEntities }
  }
}
