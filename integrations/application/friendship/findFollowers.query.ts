import { captureException } from "@sentry/node"
import db from "db"
import { Id, Username } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  take: number
  userId: Id | null
  username: Username
}

@injectable()
export class FindFollowersQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    try {
      const friendships = await db.friendship.findMany({
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
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: props.take,
        where: { followee: { username: props.username.value } },
      })

      return friendships.map((friendship) => {
        return this.queryConverter.toFollower(friendship)
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
