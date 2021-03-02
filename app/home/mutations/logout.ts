import { resolver } from "blitz"
import { RevokeSessionService } from "integrations/application"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(resolver.authorize(), async (_: unknown, ctx) => {
  const app = await createAppContext()

  const logout = await app
    .get(RevokeSessionService)
    .call({ session: ctx.session })

  if (logout instanceof Error) {
    throw logout
  }

  return null
})
