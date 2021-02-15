import { resolver } from "blitz"
import { Id, PageService, Skip, skipSchema, Take } from "integrations/domain"
import { LatestPostQuery, PostQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetPostsInfinite = z.object({ skip: skipSchema })

export default resolver.pipe(
  resolver.zod(GetPostsInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
  }),
  async ({ skip, take, userId }) => {
    const latestPostQuery = new LatestPostQuery()

    const posts = await latestPostQuery.findMany({ skip, userId })

    const postQuery = new PostQuery()

    const count = await postQuery.count()

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { hasMore, posts, nextPage }
  }
)
