import { resolver } from "blitz"
import { AccountQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const GetAccount = z.null()

const getAccount = resolver.pipe(
  resolver.zod(GetAccount),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const accountQuery = container.resolve(AccountQuery)

    const account = await accountQuery.findByUserId(userId)

    if (account === null) {
      throw new Error("")
    }

    return account
  }
)

export default getAccount
