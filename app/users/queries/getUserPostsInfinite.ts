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
import { UserPostQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetUserPostsInfinite = z.object({
  skip: zSkip,
  username: zUsername,
})

export default resolver.pipe(
  resolver.zod(GetUserPostsInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const app = await createAppContext()

    const posts = await app
      .get(UserPostQuery)
      .findMany({ skip, take, userId, username })

    const count = await app.get(UserPostQuery).count({ username })

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    const isEmpty = posts.length === 0

    return { count, posts, nextPage, hasMore, isEmpty }
  }
)
