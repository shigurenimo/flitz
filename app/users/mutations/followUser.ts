import { withSentry } from "app/core/utils/withSentry"
import { NotFoundError, resolver } from "blitz"
import { FindUserQuery } from "integrations/application"
import { FollowService } from "integrations/application/friendship/follow.service"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

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

    await followService.execute({
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

export default withSentry(followUser, "followUser")
