import { Ctx } from "blitz"
import { Id } from "domain/valueObjects"
import { NotificationRepository } from "integrations"

const checkUnreadNotifications = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const hasUnreadNotifications = await NotificationRepository.hasUnreadNotifications(
    { userId }
  )

  return hasUnreadNotifications
}

export default checkUnreadNotifications
