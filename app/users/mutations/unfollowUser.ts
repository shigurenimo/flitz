import { NotFoundError, resolver } from "blitz"
import { UnfollowUserService } from "integrations/application"
import { Id, zId } from "integrations/domain"
import { UserQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const UnfollowUser = z.object({ userId: zId })

export default resolver.pipe(
  resolver.zod(UnfollowUser),
  resolver.authorize(),
  (input, ctx) => ({
    followeeId: new Id(input.userId),
    followerId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(UnfollowUserService).call({
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
