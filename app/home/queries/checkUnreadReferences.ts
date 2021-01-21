import { Ctx } from "blitz"
import { Id } from "domain/valueObjects"
import { ReferenceRepository } from "infrastructure"

const checkUnreadReferences = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  return await ReferenceRepository.hasUnreadReference({ userId })
}

export default checkUnreadReferences
