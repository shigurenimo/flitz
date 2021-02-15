import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { UserExchangeQuery } from "integrations/infrastructure"

export default resolver.pipe(
  resolver.authorize(),
  (_: unknown, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const userExchangeQuery = new UserExchangeQuery()

    const existence = await userExchangeQuery.checkExistence({ userId })

    return existence
  }
)
