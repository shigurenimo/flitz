import { AuthorizationError, Ctx } from "blitz"
import { Id } from "domain/valueObjects"
import { UserRepository } from "infrastructure/repositories"

export default async function getCurrentUser(_ = null, ctx: Ctx) {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const userRepository = new UserRepository()

  const user = await userRepository.getUser({ userId })

  if (user === null) {
    throw new AuthorizationError()
  }

  return user
}
