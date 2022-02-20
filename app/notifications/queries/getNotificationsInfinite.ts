import { paginate, resolver } from "blitz"
import { UserNotificationQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { NotificationRepository } from "integrations/infrastructure"
import { AppNotification } from "integrations/interface/types/appNotification"
import { container } from "tsyringe"
import { z } from "zod"

const zGetNotificationsInfinite = z.object({ skip: z.number() })

const getNotificationsInfinite = resolver.pipe(
  resolver.zod(zGetNotificationsInfinite),
  resolver.authorize(),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const userNotificationQuery = container.resolve(UserNotificationQuery)

    const notifications = await userNotificationQuery.findMany(
      props.userId,
      props.skip
    )

    // TODO: BAD
    const fn = (notifications: (AppNotification | null)[]) => {
      const unreadNotifications = notifications.filter((notification) => {
        if (notification === null) return false

        return !notification.isRead
      })

      return unreadNotifications.length > 0
    }

    const hasUnread = fn(notifications)

    const notificationRepository = container.resolve(NotificationRepository)

    if (hasUnread) {
      // TODO: BAD
      await notificationRepository.markAsRead(props.userId)
    }

    const count = await userNotificationQuery.count(props.userId)

    return paginate({
      skip: props.skip,
      take: props.take,
      async count() {
        return count
      },
      async query() {
        return notifications
      },
    })
  }
)

export default getNotificationsInfinite
