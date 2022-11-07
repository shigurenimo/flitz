import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, Username } from "core"
import db from "db"
import { toAppFriendshipFollower } from "infrastructure/utils/toAppFriendship"
import { InternalError } from "integrations/errors"

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
        return toAppFriendshipFollower(prismaFriendship)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
