import { resolver } from "blitz"
import { Id, PageService, Skip, skipSchema, Take } from "integrations/domain"
import { UserExchangeQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetExchanges = z.object({ skip: skipSchema })

export default resolver.pipe(
  resolver.zod(GetExchanges),
  resolver.authorize(),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(16),
    userId: new Id(ctx.session.userId),
  }),
  async ({ skip, take, userId }) => {
    const userExchangeQuery = new UserExchangeQuery()

    const exchanges = await userExchangeQuery.findMany({ userId, skip })

    const count = await userExchangeQuery.count({ userId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    const isEmpty = exchanges.length === 0

    return { isEmpty, nextPage, exchanges, hasMore, count }
  }
)
