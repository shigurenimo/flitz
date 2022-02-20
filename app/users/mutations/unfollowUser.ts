import { withSentry } from "app/core/utils/withSentry"
import { NotFoundError, resolver } from "blitz"
import { FindUserQuery, UnfollowService } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

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

    await unfollowService.execute({
      followeeId: props.followeeId,
      followerId: props.followerId,
    })

    const findUserQuery = container.resolve(FindUserQuery)

    const profile = await findUserQuery.execute({
      userId: props.followerId,
    })

    if (profile === null) {
      throw new NotFoundError()
    }

    return profile
  }
)

export default withSentry(unfollowUser, "unfollowUser")
