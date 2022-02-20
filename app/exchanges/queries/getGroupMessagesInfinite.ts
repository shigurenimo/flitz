import { NotFoundError, paginate, resolver } from "blitz"
import { ExchangeMessageQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetExchangeMessagesInfinite = z.object({
  exchangeId: z.string(),
  skip: z.number(),
})

const getGroupMessagesInfinite = resolver.pipe(
  resolver.zod(zGetExchangeMessagesInfinite),
  resolver.authorize(),
  (props) => {
    return {
      exchangeId: new Id(props.exchangeId),
      skip: props.skip,
      take: 16,
    }
  },
  async (props) => {
    const exchangeMessageQuery = container.resolve(ExchangeMessageQuery)

    const messages = await exchangeMessageQuery.findMany({
      skip: props.skip,
      exchangeId: props.exchangeId,
    })

    if (messages === null) {
      throw new NotFoundError()
    }

    return paginate({
      skip: props.skip,
      take: props.take,
      async count() {
        // TODO: FIX
        return messages.length
      },
      async query() {
        return messages
      },
    })
  }
)

export default getGroupMessagesInfinite
