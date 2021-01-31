import { Ctx } from "blitz"
import { Id } from "domain/valueObjects"
import { NotificationRepository } from "infrastructure/repositories"

const checkUnreadNotifications = async (_ = null, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const notificationRepository = new NotificationRepository()

  const hasUnreadNotifications = await notificationRepository.hasUnreadNotifications(
    { userId }
  )

  return hasUnreadNotifications
}

export default checkUnreadNotifications
