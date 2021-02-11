import { resolver } from "blitz"
import { Id } from "integrations/domain/valueObjects"
import { NotificationRepository } from "integrations/infrastructure/repositories"
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
