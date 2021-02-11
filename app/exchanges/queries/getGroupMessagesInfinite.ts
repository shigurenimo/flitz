import { NotFoundError, resolver } from "blitz"
import { PageService } from "integrations/domain/services"
import { Id, idSchema, Skip, skipSchema, Take } from "integrations/domain/valueObjects"
import {
  ExchangeRepository,
  MessageRepository,
} from "integrations/infrastructure/repositories"
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
    const exchangeRepository = new ExchangeRepository()

    const { exchange } = await exchangeRepository.getExchange({
      skip,
      exchangeId,
    })

    if (exchange === null) {
      throw new NotFoundError()
    }

    const messageRepository = new MessageRepository()

    const count = await messageRepository.countUserGroupMessages({ exchangeId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { messages: exchange.messages, nextPage }
  }
)
