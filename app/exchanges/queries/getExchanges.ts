import { resolver } from "blitz"
import { Id, PageService, Skip, Take, zSkip } from "integrations/domain"
import { UserExchangeQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetExchanges = z.object({ skip: zSkip })

export default resolver.pipe(
  resolver.zod(GetExchanges),
  resolver.authorize(),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(16),
    userId: new Id(ctx.session.userId),
  }),
  async ({ skip, take, userId }) => {
    const app = await createAppContext()

    const exchanges = await app
      .get(UserExchangeQuery)
      .findMany({ userId, skip })

    const count = await app.get(UserExchangeQuery).count({ userId })

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    const isEmpty = exchanges.length === 0

    return { isEmpty, nextPage, exchanges, hasMore, count }
  }
)
