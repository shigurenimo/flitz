import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import {
  CountUserNotificationsQuery,
  FindUserNotificationsQuery,
  MarkNotificationAsReadService,
} from "application"
import { Id } from "core"
import { AppNotification } from "integrations/types/appNotification"
import { withSentry } from "interface/core/utils/withSentry"

const zProps = z.object({
  skip: z.number(),
})

const getNotifications = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const findNotificationsQuery = container.resolve(FindUserNotificationsQuery)

    const notifications = await findNotificationsQuery.execute({
      userId: props.userId,
      skip: props.skip,
    })

    if (notifications instanceof Error) {
      throw notifications
    }

    // TODO: BAD
    const fn = (notifications: (AppNotification | null)[]) => {
      const unreadNotifications = notifications.filter((notification) => {
        if (notification === null) return false

        return !notification.isRead
      })

      return unreadNotifications.length > 0
    }

    const hasUnread = fn(notifications)

    const markNotificationAsReadService = container.resolve(
      MarkNotificationAsReadService
    )

    if (hasUnread) {
      await markNotificationAsReadService.execute({ userId: props.userId })
    }

    const countNotificationsQuery = container.resolve(
      CountUserNotificationsQuery
    )

    const count = await countNotificationsQuery.execute({
      userId: props.userId,
    })

    if (count instanceof Error) {
      throw count
    }

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

export default withSentry(getNotifications, "getNotifications")
