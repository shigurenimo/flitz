import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { UserNotificationQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const CheckUnreadNotifications = z.null()

export default resolver.pipe(
  resolver.zod(CheckUnreadNotifications),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    const hasUnreadNotifications = await app
      .get(UserNotificationQuery)
      .hasUnread(input.userId)

    return hasUnreadNotifications
  }
)
