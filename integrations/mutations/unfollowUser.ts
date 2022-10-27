import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { FindUserQuery, UnfollowService } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zProps = z.object({
  userId: z.string(),
})

const unfollowUser = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      followeeId: new Id(props.userId),
      followerId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const unfollowService = container.resolve(UnfollowService)

    const transaction = await unfollowService.execute({
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

export default withSentry(unfollowUser, "unfollowUser")
