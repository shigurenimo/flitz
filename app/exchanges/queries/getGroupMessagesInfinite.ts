import { Ctx, NotFoundError } from "blitz"
import { PageService } from "domain/services"
import { Id, idSchema, Skip, skipSchema, Take } from "domain/valueObjects"
import {
  ExchangeRepository,
  MessageRepository,
} from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  skip: skipSchema,
  exchangeId: idSchema,
})

const getExchangeMessagesInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const skip = new Skip(input.skip)

  const exchangeId = new Id(input.exchangeId)

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

  const take = new Take()

  const pageService = new PageService()

  const hasMore = pageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

  return { messages: exchange.messages, nextPage }
}

export default getExchangeMessagesInfinite
