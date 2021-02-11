import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { ReferenceRepository } from "integrations/infrastructure"

export default resolver.pipe(
  resolver.authorize(),
  (_: unknown, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const referenceRepository = new ReferenceRepository()

    return await referenceRepository.hasUnreadReference({ userId })
  }
)
