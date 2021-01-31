import { Ctx } from "blitz"
import { Id } from "domain/valueObjects"
import { ExchangeRepository } from "infrastructure/repositories"

const checkUnreadMessages = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const exchangeRepository = new ExchangeRepository()

  const messages = await exchangeRepository.getUserExchange({ userId })

  return messages !== null
}

export default checkUnreadMessages
