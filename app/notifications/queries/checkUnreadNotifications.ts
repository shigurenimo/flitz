import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { NotificationRepository } from "integrations/infrastructure"
import * as z from "zod"

const CheckUnreadNotifications = z.null()

export default resolver.pipe(
  resolver.zod(CheckUnreadNotifications),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const notificationRepository = new NotificationRepository()

    const hasUnreadNotifications = await notificationRepository.hasUnreadNotifications(
      { userId }
    )

    return hasUnreadNotifications
  }
)
