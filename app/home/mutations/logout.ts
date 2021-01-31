import { Ctx } from "blitz"
import { SessionRepository } from "infrastructure/repositories"

const logout = async (_: any, ctx: Ctx) => {
  const sessionRepository = new SessionRepository()

  await sessionRepository.revokeSession(ctx.session)
}

export default logout
