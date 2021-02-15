import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { ReferenceQuery } from "integrations/infrastructure"

export default resolver.pipe(
  resolver.authorize(),
  (_: unknown, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const referenceQuery = new ReferenceQuery()

    const hasUnread = await referenceQuery.hasUnread({ userId })

    return hasUnread
  }
)
