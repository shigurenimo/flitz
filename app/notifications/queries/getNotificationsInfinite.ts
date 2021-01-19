import { Ctx } from "blitz"
import { NotificationService, PageService } from "domain/services"
import { Id, Skip, skipSchema, Take } from "domain/valueObjects"
import { NotificationRepository } from "integrations"
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

  const notifications = await NotificationRepository.findNotifications({
    skip,
    userId,
  })

  const hasUnreadNotifications = NotificationService.hasUnreadNotifications({
    notifications,
  })

  if (hasUnreadNotifications) {
    await NotificationRepository.markNotificationsAsRead({ userId })
  }

  const count = await NotificationRepository.countNotifications({ userId })

  const take = new Take()

  const hasMore = PageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? PageService.nextPage({ take, skip }) : null

  return { notifications, hasMore, nextPage }
}

export default getNotificationsInfinite
