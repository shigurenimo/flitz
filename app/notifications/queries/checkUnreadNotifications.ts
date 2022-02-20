import { resolver } from "blitz"
import { UserNotificationQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zCheckUnreadNotifications = z.null()

const checkUnreadNotifications = resolver.pipe(
  resolver.zod(zCheckUnreadNotifications),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const sendMessageService = container.resolve(UserNotificationQuery)

    const hasUnreadNotifications = await sendMessageService.hasUnread(
      props.userId
    )

    return hasUnreadNotifications
  }
)

export default checkUnreadNotifications
