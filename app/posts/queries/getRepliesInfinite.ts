import { resolver } from "blitz"
import {
  Id,
  idSchema,
  PageService,
  Skip,
  skipSchema,
  Take,
} from "integrations/domain"
import { ReplyQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetRepliesInfinite = z.object({
  skip: skipSchema,
  replyId: idSchema,
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
    const replyQuery = new ReplyQuery()

    const posts = await replyQuery.findMany({
      skip,
      take,
      replyId,
      userId,
    })

    const count = await replyQuery.count({ replyId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { hasMore, posts, nextPage }
  }
)
