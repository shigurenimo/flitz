import { Ctx } from "blitz"
import db from "db"

const checkUnreadMessages = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = ctx.session.userId

  const messages = await db.exchange.findFirst({
    where: {
      messages: {
        some: {
          isRead: false,
          userId: { not: userId },
        },
      },
      userId,
    },
  })

  return messages !== null
}

export default checkUnreadMessages
