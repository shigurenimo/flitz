import { Ctx } from "blitz"
import db from "db"

const checkUnreadReferences = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = ctx.session.userId

  const reference = await db.reference.findFirst({
    where: {
      isRead: false,
      userId,
    },
  })

  return reference !== null
}

export default checkUnreadReferences
