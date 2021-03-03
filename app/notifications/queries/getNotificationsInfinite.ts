import { resolver } from "blitz"
import {
  Id,
  NotificationRepository,
  NotificationService,
  PageService,
  Skip,
  Take,
  zSkip,
} from "integrations/domain"
import { UserNotificationQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetNotificationsInfinite = z.object({ skip: zSkip })

export default resolver.pipe(
  resolver.zod(GetNotificationsInfinite),
  resolver.authorize(),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    const notifications = await app
      .get(UserNotificationQuery)
      .findMany(input.userId, input.skip)

    const hasUnread = app.get(NotificationService).hasUnread(notifications)

    if (hasUnread) {
      await app.get(NotificationRepository).markAsRead(input.userId)
    }

    const count = await app.get(UserNotificationQuery).count(input.userId)

    const hasMore = app.get(PageService).hasMore(input.skip, input.take, count)

    const nextPage = hasMore
      ? app.get(PageService).nextPage(input.take, input.skip)
      : null

    return { notifications, hasMore, nextPage }
  }
)
