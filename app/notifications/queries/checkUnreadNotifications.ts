import { NotificationRepository } from "domain/repositories"
import { Id } from "domain/valueObjects"
import { Ctx } from "blitz"

const checkUnreadNotifications = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const hasUnreadNotifications = await NotificationRepository.hasUnreadNotifications(
    { userId }
  )

  return hasUnreadNotifications
}

export default checkUnreadNotifications
