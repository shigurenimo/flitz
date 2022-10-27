import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, Username } from "core"
import db from "db"
import { PrismaFollower } from "infrastructure/types/prismaFollower"
import { InternalError } from "integrations/errors"
import { AppFriendship } from "integrations/types"

type Props = {
  skip: number
  take: number
  userId: Id | null
  username: Username
}

@injectable()
export class FindFollowersQuery {
  async execute(props: Props) {
    try {
      const friendships = await db.friendship.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: props.take,
        where: { followee: { username: props.username.value } },
        include: {
          follower: {
            include: {
              // 自分にフォローされているかどうか
              followees: props.userId
                ? { where: { followeeId: props.userId.value } }
                : false,
              // 自分をフォローしているかどうか
              followers: props.userId
                ? { where: { followerId: props.userId.value } }
                : false,
            },
          },
        },
      })

      return friendships.map((prismaFriendship) => {
        return this.toFriendship(prismaFriendship)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }

  toFriendship(prismaFriendship: PrismaFollower): AppFriendship {
    return {
      id: prismaFriendship.id,
      createdAt: prismaFriendship.createdAt,
      userId: prismaFriendship.follower.id,
      username: prismaFriendship.follower.username || null,
      name: prismaFriendship.follower.name || null,
      biography: prismaFriendship.follower.biography,
      isFollowee: 0 < prismaFriendship.follower.followersCount,
      isFollower: 0 < prismaFriendship.follower.followeesCount,
    }
  }
}
