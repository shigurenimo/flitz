import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { FindUserQuery } from "service"
import { FollowService } from "service/friendship/follow.service"

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
    const service = container.resolve(FollowService)

    const result = await service.execute({
      followeeId: props.followeeId,
      followerId: props.followerId,
    })

    if (result instanceof Error) {
      throw result
    }

    const query = container.resolve(FindUserQuery)

    const user = await query.execute({
      userId: props.followerId,
    })

    if (user instanceof Error) {
      throw user
    }

    return user
  }
)

export default withSentry(followUser, "followUser")
