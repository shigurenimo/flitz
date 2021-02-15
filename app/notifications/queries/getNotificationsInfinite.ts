import { resolver } from "blitz"
import {
  Id,
  NotificationService,
  PageService,
  Skip,
  skipSchema,
  Take,
} from "integrations/domain"
import {
  NotificationRepository,
  UserNotificationQuery,
} from "integrations/infrastructure"
import * as z from "zod"

const GetNotificationsInfinite = z.object({ skip: skipSchema })

export default resolver.pipe(
  resolver.zod(GetNotificationsInfinite),
  resolver.authorize(),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: new Id(ctx.session.userId),
  }),
  async ({ skip, take, userId }) => {
    const userNotificationQuery = new UserNotificationQuery()

    const notifications = await userNotificationQuery.findMany({ skip, userId })

    const notificationService = new NotificationService()

    const hasUnread = notificationService.hasUnread({ notifications })

    if (hasUnread) {
      const notificationRepository = new NotificationRepository()

      await notificationRepository.markAsRead({ userId })
    }

    const count = await userNotificationQuery.count({ userId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { notifications, hasMore, nextPage }
  }
)
