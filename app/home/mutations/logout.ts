import { SessionRepository } from "domain/repositories"
import { Ctx } from "blitz"

const logout = async (_: any, ctx: Ctx) => {
  await SessionRepository.revokeSession(ctx.session)
}

export default logout
