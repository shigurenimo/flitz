import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, Username } from "core"
import db from "db"
import { PrismaFollowee } from "infrastructure/types/prismaFollowee"
import { InternalError } from "integrations/errors"
import { AppFriendship } from "integrations/types"

type Props = {
  skip: number
  take: number
  userId: Id | null
  username: Username
}

@injectable()
export class FindFolloweesQuery {
  async execute(props: Props) {
    try {
      const prismaFriendships = await db.friendship.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: props.take,
        where: { follower: { username: props.username.value } },
        include: {
          followee: {
            include: {
              followees: props.userId
                ? { where: { followeeId: props.userId.value } }
                : false,
              followers: props.userId
                ? { where: { followerId: props.userId.value } }
                : false,
            },
          },
        },
      })

      return prismaFriendships.map((prismaFriendship) => {
        return this.toAppFriendship(prismaFriendship)
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }

  toAppFriendship(prismaFriendship: PrismaFollowee): AppFriendship {
    return {
      id: prismaFriendship.id,
      createdAt: prismaFriendship.createdAt,
      userId: prismaFriendship.followee.id,
      username: prismaFriendship.followee.username || null,
      name: prismaFriendship.followee.name || null,
      biography: prismaFriendship.followee.biography,
      isFollowee: prismaFriendship.followee.followeesCount > 0,
      isFollower: prismaFriendship.followee.followersCount > 0,
    }
  }
}
