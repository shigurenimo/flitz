import { ExchangeRepository } from "domain/repositories/exchangeRepository"
import { Id } from "domain/valueObjects"
import { Ctx } from "blitz"

const checkUnreadMessages = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const messages = await ExchangeRepository.getUserExchange({ userId })

  return messages !== null
}

export default checkUnreadMessages
