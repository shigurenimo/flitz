import db from "db"
import { FriendshipEntity } from "integrations/domain"
import { Id } from "integrations/domain/valueObjects"

export class FriendshipRepository {
  async find(followerId: Id, followeeId: Id) {
    const friendship = await db.friendship.findUnique({
      where: {
        followerId_followeeId: {
          followerId: followerId.value,
          followeeId: followeeId.value,
        },
      },
    })

    if (friendship === null) {
      return null
    }

    return new FriendshipEntity({
      id: new Id(friendship.id),
      followeeId: new Id(friendship.followeeId),
      followerId: new Id(friendship.followerId),
    })
  }

  async findManyByFolloweeId(followeeId: Id) {
    const friendships = await db.friendship.findMany({
      where: { followeeId: followeeId.value },
      take: 20000,
    })

    const friendshipEntities = friendships.map((friendship) => {
      return new FriendshipEntity({
        id: new Id(friendship.id),
        followeeId: new Id(friendship.followeeId),
        followerId: new Id(friendship.followerId),
      })
    })

    return friendshipEntities
  }

  async follow(friendship: FriendshipEntity) {
    await db.$transaction([
      db.user.update({
        data: {
          followers: {
            create: {
              id: friendship.id.value,
              follower: { connect: { id: friendship.followerId.value } },
            },
          },
          followersCount: { increment: 1 },
        },
        include: {
          followers: {
            where: { followerId: friendship.followerId.value },
          },
          iconImage: true,
          headerImage: true,
        },
        where: { id: friendship.followeeId.value },
      }),
      db.user.update({
        data: { followeesCount: { increment: 1 } },
        where: { id: friendship.followerId.value },
      }),
    ])

    return null
  }

  async unfollow(friendship: FriendshipEntity) {
    await db.$transaction([
      db.user.update({
        data: {
          followers: {
            delete: {
              followerId_followeeId: {
                followerId: friendship.followerId.value,
                followeeId: friendship.followeeId.value,
              },
            },
          },
          followersCount: { decrement: 1 },
        },
        include: {
          followers: {
            where: { followerId: friendship.followerId.value },
          },
          iconImage: true,
          headerImage: true,
        },
        where: { id: friendship.followeeId.value },
      }),
      db.user.update({
        data: { followeesCount: { decrement: 1 } },
        where: { id: friendship.followerId.value },
      }),
    ])

    return null
  }
}
