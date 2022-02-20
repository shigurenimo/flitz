import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { HasUnreadNotificationQuery } from "integrations/application"
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
    const hasUnreadNotificationQuery = container.resolve(
      HasUnreadNotificationQuery
    )

    const hasUnread = await hasUnreadNotificationQuery.execute({
      userId: props.userId,
    })

    return hasUnread
  }
)

export default withSentry(checkUnreadNotifications, "checkUnreadNotifications")
