import { Ctx } from "blitz"
import { NotificationService, PageService } from "domain/services"
import { Id, Skip, skipSchema, Take } from "domain/valueObjects"
import { NotificationRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({ skip: skipSchema })

const getNotificationsInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const skip = new Skip(input.skip)

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

  const take = new Take()

  const pageService = new PageService()

  const hasMore = pageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

  return { notifications, hasMore, nextPage }
}

export default getNotificationsInfinite
