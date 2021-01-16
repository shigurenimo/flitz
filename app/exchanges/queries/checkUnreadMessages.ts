import { ExchangeRepository } from "app/domain/repositories/exchangeRepository"
import { Id } from "app/domain/valueObjects"
import { Ctx } from "blitz"

const checkUnreadMessages = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const messages = await ExchangeRepository.findExchange({ userId })

  return messages !== null
}

export default checkUnreadMessages
