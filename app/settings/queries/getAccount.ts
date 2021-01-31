import { Ctx } from "blitz"
import {
  AccountRepository,
  SessionRepository,
} from "infrastructure/repositories"

const getAccount = async (_: any, ctx: Ctx) => {
  ctx.session.authorize()

  const sessionRepository = new SessionRepository()

  const userId = sessionRepository.getUserId(ctx.session)

  const accountRepository = new AccountRepository()

  const { account } = await accountRepository.findByUserId(userId)

  if (account === null) {
    throw new Error("")
  }

  return {
    email: account.email,
    userId: account.userId,
  }
}

export default getAccount
