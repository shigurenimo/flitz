import { ReferenceRepository } from "app/domain/repositories"
import { Id } from "app/domain/valueObjects"
import { Ctx } from "blitz"

const checkUnreadReferences = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  return await ReferenceRepository.hasUnreadReference({ userId })
}

export default checkUnreadReferences
