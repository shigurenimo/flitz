import { resolver } from "blitz"
import { Id } from "domain/valueObjects"
import { ExchangeRepository } from "infrastructure/repositories"

export default resolver.pipe(
  resolver.authorize(),
  (_: unknown, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const exchangeRepository = new ExchangeRepository()

    const { exchange } = await exchangeRepository.getUserExchange({ userId })

    return exchange !== null
  }
)
