import { NotFoundError, resolver } from "blitz"
import { UnfollowUserService, UserQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zUnfollowUser = z.object({
  userId: z.string(),
})

const unfollowUser = resolver.pipe(
  resolver.zod(zUnfollowUser),
  resolver.authorize(),
  (props, ctx) => {
    return {
      followeeId: new Id(props.userId),
      followerId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const unfollowUserService = container.resolve(UnfollowUserService)

    await unfollowUserService.execute({
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

export default unfollowUser
