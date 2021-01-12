import { Ctx } from "blitz"
import db from "db"

const checkUnreadNotifications = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = ctx.session.userId

  const notification = await db.notification.findFirst({
    where: {
      isRead: false,
      userId,
    },
  })

  return notification !== null
}

export default checkUnreadNotifications
