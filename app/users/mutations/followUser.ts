import { NotFoundError, resolver } from "blitz"
import { FollowUserService } from "integrations/application/followUser.service"
import { Id, zId } from "integrations/domain"
import { UserQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const FollowUser = z.object({ userId: zId })

export default resolver.pipe(
  resolver.zod(FollowUser),
  resolver.authorize(),
  (input, ctx) => ({
    followeeId: new Id(input.userId),
    followerId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(FollowUserService).call({
      followeeId: input.followeeId,
      followerId: input.followerId,
    })

    const queryProfile = await app.get(UserQuery).find(input.followerId)

    if (queryProfile === null) {
      throw new NotFoundError()
    }

    return queryProfile
  }
)
