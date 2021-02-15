import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { UserNotificationQuery } from "integrations/infrastructure"
import * as z from "zod"

const CheckUnreadNotifications = z.null()

export default resolver.pipe(
  resolver.zod(CheckUnreadNotifications),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const notificationQuery = new UserNotificationQuery()

    const hasUnreadNotifications = await notificationQuery.hasUnread({ userId })

    return hasUnreadNotifications
  }
)
