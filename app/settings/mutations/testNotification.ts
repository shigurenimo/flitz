import { MessagingService } from "app/services"
import { resolver } from "blitz"
import { SessionRepository } from "integrations/infrastructure"
import * as z from "zod"

const TestNotification = z.null()

export default resolver.pipe(
  resolver.zod(TestNotification),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new SessionRepository().getUserId(ctx.session),
  }),
  ({ userId }) => {
    const messagingService = new MessagingService()

    return messagingService.sendTestMesasge({ userId })
  }
)
