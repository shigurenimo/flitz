import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { AccountQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetAccount = z.null()

export default resolver.pipe(
  resolver.zod(GetAccount),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const app = await createAppContext()

    const account = await app.get(AccountQuery).findByUserId(userId)

    if (account === null) {
      throw new Error("")
    }

    return account
  }
)
