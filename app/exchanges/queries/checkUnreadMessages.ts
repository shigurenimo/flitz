import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { UserExchangeQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(
  resolver.authorize(),
  (_: unknown, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const app = await createAppContext()

    const existence = await app
      .get(UserExchangeQuery)
      .checkExistence({ userId })

    return existence
  }
)
