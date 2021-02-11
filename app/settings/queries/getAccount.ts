import { resolver } from "blitz"
import { Id } from "integrations/domain/valueObjects"
import { AccountRepository } from "integrations/infrastructure/repositories"
import * as z from "zod"

const GetAccount = z.null()

export default resolver.pipe(
  resolver.zod(GetAccount),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
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
)
