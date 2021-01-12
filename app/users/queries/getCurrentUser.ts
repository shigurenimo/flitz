import { AuthorizationError, Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, ctx: Ctx) {
  ctx.session.authorize()

  const user = await db.user.findFirst({
    where: { id: ctx.session.userId },
  })

  if (user === null) {
    throw new AuthorizationError()
  }

  return user
}
