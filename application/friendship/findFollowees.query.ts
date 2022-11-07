import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, Username } from "core"
import db from "db"
import { toAppFriendshipFollowee } from "infrastructure/utils/toAppFriendshipFollowee"
import { InternalError } from "integrations/errors"

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
      const friendships = await db.friendship.findMany({
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

      return friendships.map((prismaFriendship) => {
        return toAppFriendshipFollowee(prismaFriendship)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
