import { resolver } from "blitz"
import { PageService } from "domain/services"
import { Id, Skip, skipSchema, Take } from "domain/valueObjects"
import { ExchangeRepository } from "infrastructure/repositories"
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
    const exchangeRepository = new ExchangeRepository()

    const { exchanges } = await exchangeRepository.getUserExchanges({
      userId,
      skip,
    })

    const count = await exchangeRepository.countUserExchanges({ userId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    const isEmpty = exchanges.length === 0

    return { isEmpty, nextPage, exchanges, hasMore, count }
  }
)
