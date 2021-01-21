import { Ctx } from "blitz"
import { Id } from "domain/valueObjects"
import { ExchangeRepository } from "infrastructure/exchangeRepository"

const checkUnreadMessages = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const messages = await ExchangeRepository.getUserExchange({ userId })

  return messages !== null
}

export default checkUnreadMessages
