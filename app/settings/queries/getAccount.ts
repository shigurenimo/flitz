import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { AccountsQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetAccount = z.null()

export default resolver.pipe(
  resolver.zod(GetAccount),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const accountQuery = new AccountsQuery()

    const account = await accountQuery.findByUserId(userId)

    if (account === null) {
      throw new Error("")
    }

    return account
  }
)
