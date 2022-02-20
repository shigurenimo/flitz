import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"

const logout = resolver.pipe(resolver.authorize(), async (_, ctx) => {
  await ctx.session.$revoke()

  if (logout instanceof Error) {
    throw logout
  }

  return null
})

export default withSentry(logout, "logout")
