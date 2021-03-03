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
import { UserLikeQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetUserLikesInfinite = z.object({
  skip: zSkip,
  username: zUsername,
})

export default resolver.pipe(
  resolver.zod(GetUserLikesInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const app = await createAppContext()

    const likes = await app
      .get(UserLikeQuery)
      .findMany({ skip, take, userId, username })

    const count = await app.get(UserLikeQuery).count(username)

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    const isEmpty = likes.length === 0

    return { count, likes, nextPage, hasMore, isEmpty }
  }
)
