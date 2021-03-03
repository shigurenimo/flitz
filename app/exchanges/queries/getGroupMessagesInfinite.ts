import { NotFoundError, resolver } from "blitz"
import { Id, PageService, Skip, Take, zId, zSkip } from "integrations/domain"
import { ExchangeMessageQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetExchangeMessagesInfinite = z.object({
  exchangeId: zId,
  skip: zSkip,
})

export default resolver.pipe(
  resolver.zod(GetExchangeMessagesInfinite),
  resolver.authorize(),
  (input) => ({
    exchangeId: new Id(input.exchangeId),
    skip: new Skip(input.skip),
    take: new Take(),
  }),
  async ({ exchangeId, skip, take }) => {
    const app = await createAppContext()

    const messages = await app.get(ExchangeMessageQuery).findMany({
      skip,
      exchangeId,
    })

    if (messages === null) {
      throw new NotFoundError()
    }

    const count = await app.get(ExchangeMessageQuery).count(exchangeId)

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    return { messages, nextPage }
  }
)
