import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import { FindUserQuery, UnfollowService } from "integrations/application"
import { Id } from "integrations/domain"

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
