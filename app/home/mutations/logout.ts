import { Ctx } from "blitz"
import { SessionRepository } from "integrations"

const logout = async (_: any, ctx: Ctx) => {
  await SessionRepository.revokeSession(ctx.session)
}

export default logout
