import { resolver } from "@blitzjs/rpc"
import { withSentry } from "interface/core/utils/withSentry"

const logout = resolver.pipe(resolver.authorize(), async (_, ctx) => {
  await ctx.session.$revoke()

  return null
})

export default withSentry(logout, "logout")
