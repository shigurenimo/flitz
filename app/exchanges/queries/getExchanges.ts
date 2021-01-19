import { Ctx } from "blitz"
import { PageService } from "domain/services"
import { Id, Skip, skipSchema, Take } from "domain/valueObjects"
import { ExchangeRepository } from "integrations"
import * as z from "zod"

const inputSchema = z.object({ skip: skipSchema })

const getExchanges = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const skip = new Skip(input.skip)

  const userId = new Id(ctx.session.userId)

  const exchanges = await ExchangeRepository.getUserExchanges({ userId, skip })

  const count = await ExchangeRepository.countUserExchanges({ userId })

  const take = new Take(16)

  const hasMore = PageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? PageService.nextPage({ take, skip }) : null

  const isEmpty = exchanges.length === 0

  return { isEmpty, nextPage, exchanges, hasMore, count }
}

export default getExchanges
