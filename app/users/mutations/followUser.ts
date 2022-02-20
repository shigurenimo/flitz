import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
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

    const update = await followService.execute({
      followeeId: props.followeeId,
      followerId: props.followerId,
    })

    if (update instanceof Error) {
      throw update
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
