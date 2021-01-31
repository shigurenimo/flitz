import { Ctx } from "blitz"
import { Id } from "domain/valueObjects"
import { ReferenceRepository } from "infrastructure/repositories"

const checkUnreadReferences = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const referenceRepository = new ReferenceRepository()

  return await referenceRepository.hasUnreadReference({ userId })
}

export default checkUnreadReferences
