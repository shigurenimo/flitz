import { Ctx } from "blitz"
import { AccountRepository, SessionRepository } from "infrastructure"

const getAccount = async (_: any, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = SessionRepository.getUserId(ctx.session)

  const account = await AccountRepository.findByUserId(userId)

  if (account === null) {
    throw new Error("")
  }

  return {
    email: account.email,
    userId: account.userId,
  }
}

export default getAccount
