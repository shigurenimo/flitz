import { NotFoundError, resolver } from "blitz"
import { UserQuery } from "integrations/application"
import { FollowUserService } from "integrations/application/user/followUser.service"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zFollowUser = z.object({ userId: z.string() })

const followUser = resolver.pipe(
  resolver.zod(zFollowUser),
  resolver.authorize(),
  (props, ctx) => {
    return {
      followeeId: new Id(props.userId),
      followerId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const followUserService = container.resolve(FollowUserService)

    await followUserService.execute({
      followeeId: props.followeeId,
      followerId: props.followerId,
    })

    const userQuery = container.resolve(UserQuery)

    const queryProfile = await userQuery.find(props.followerId)

    if (queryProfile === null) {
      throw new NotFoundError()
    }

    return queryProfile
  }
)

export default followUser
