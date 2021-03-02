import { resolver } from "blitz"
import {
  Id,
  PageService,
  Skip,
  Take,
  Username,
  zSkip,
  zUsername,
} from "integrations/domain"
import { UserFolloweerQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetUserFollowersInfinite = z.object({
  skip: zSkip,
  username: zUsername,
})

export default resolver.pipe(
  resolver.zod(GetUserFollowersInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const app = await createAppContext()

    const friendships = await app.get(UserFolloweerQuery).findByUsername({
      skip,
      take,
      userId,
      username,
    })

    const count = await app.get(UserFolloweerQuery).count({ username })

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    return { count, hasMore, friendships, nextPage }
  }
)
