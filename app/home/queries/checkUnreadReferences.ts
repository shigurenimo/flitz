import { resolver } from "blitz"
import { Id } from "domain/valueObjects"
import { ReferenceRepository } from "infrastructure/repositories"

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
