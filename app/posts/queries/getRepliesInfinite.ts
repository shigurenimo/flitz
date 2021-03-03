import { resolver } from "blitz"
import { Id, PageService, Skip, Take, zId, zSkip } from "integrations/domain"
import { ReplyQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetRepliesInfinite = z.object({
  skip: zSkip,
  replyId: zId,
})

export default resolver.pipe(
  resolver.zod(GetRepliesInfinite),
  (input, ctx) => ({
    replyId: new Id(input.replyId),
    skip: new Skip(input.skip),
    take: new Take(),
    userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
  }),
  async ({ replyId, skip, take, userId }) => {
    const app = await createAppContext()

    const posts = await app.get(ReplyQuery).findMany({
      skip,
      take,
      replyId,
      userId,
    })

    const count = await app.get(ReplyQuery).count({ replyId })

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    return { hasMore, posts, nextPage }
  }
)
