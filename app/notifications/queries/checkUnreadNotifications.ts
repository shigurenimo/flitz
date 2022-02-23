import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { CheckUnreadUserNotificationQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.null()

const checkUnreadNotifications = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const checkUnreadUserNotificationQuery = container.resolve(
      CheckUnreadUserNotificationQuery
    )

    const hasUnread = await checkUnreadUserNotificationQuery.execute({
      userId: props.userId,
    })

    if (hasUnread instanceof Error) {
      throw hasUnread
    }

    return hasUnread
  }
)

export default withSentry(checkUnreadNotifications, "checkUnreadNotifications")
