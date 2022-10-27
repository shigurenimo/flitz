import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { FindUserQuery } from "application"
import { FollowService } from "application/friendship/follow.service"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zProps = z.object({ userId: z.string() })

const followUser = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      followeeId: new Id(props.userId),
      followerId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const followService = container.resolve(FollowService)

    const transaction = await followService.execute({
      followeeId: props.followeeId,
      followerId: props.followerId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    const findUserQuery = container.resolve(FindUserQuery)

    const user = await findUserQuery.execute({
      userId: props.followerId,
    })

    if (user instanceof Error) {
      throw user
    }

    return user
  }
)

export default withSentry(followUser, "followUser")
