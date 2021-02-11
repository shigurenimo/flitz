import { resolver } from "blitz"
import { SessionRepository } from "integrations/infrastructure/repositories"

export default resolver.pipe(resolver.authorize(), async (_: unknown, ctx) => {
  const sessionRepository = new SessionRepository()

  await sessionRepository.revokeSession(ctx.session)

  return null
})
