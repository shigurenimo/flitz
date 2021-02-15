import { NotFoundError, resolver } from "blitz"
import {
  Id,
  idSchema,
  PageService,
  Skip,
  skipSchema,
  Take,
} from "integrations/domain"
import { ExchangeMessageQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetExchangeMessagesInfinite = z.object({
  exchangeId: idSchema,
  skip: skipSchema,
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
    const exchangeMessageQuery = new ExchangeMessageQuery()

    const messages = await exchangeMessageQuery.findMany({
      skip,
      exchangeId,
    })

    if (messages === null) {
      throw new NotFoundError()
    }

    const count = await exchangeMessageQuery.count({ exchangeId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { messages, nextPage }
  }
)
