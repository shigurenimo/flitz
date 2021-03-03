import { resolver } from "blitz"
import { Id, PageService, Skip, Take, zSkip } from "integrations/domain"
import { LatestPostQuery, PostQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetPostsInfinite = z.object({ skip: zSkip })

export default resolver.pipe(
  resolver.zod(GetPostsInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
  }),
  async ({ skip, take, userId }) => {
    const app = await createAppContext()

    const posts = await app.get(LatestPostQuery).findMany({ skip, userId })

    const count = await app.get(PostQuery).count()

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    return { hasMore, posts, nextPage }
  }
)
