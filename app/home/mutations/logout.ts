import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"

const logout = resolver.pipe(resolver.authorize(), async (_, ctx) => {
  await ctx.session.$revoke()

  return null
})

export default withSentry(logout, "logout")
