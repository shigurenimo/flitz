import { resolver } from "blitz"
import { NotificationService, PageService } from "integrations/domain/services"
import { Id, Skip, skipSchema, Take } from "integrations/domain/valueObjects"
import { NotificationRepository } from "integrations/infrastructure/repositories"
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
    const notificationRepository = new NotificationRepository()

    const {
      notifications,
      notificationEntities,
    } = await notificationRepository.findNotifications({
      skip,
      userId,
    })

    const notificationService = new NotificationService()

    const hasUnreadNotifications = notificationService.hasUnreadNotifications({
      notificationEntities,
    })

    if (hasUnreadNotifications) {
      await notificationRepository.markNotificationsAsRead({ userId })
    }

    const count = await notificationRepository.countNotifications({ userId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { notifications, hasMore, nextPage }
  }
)
