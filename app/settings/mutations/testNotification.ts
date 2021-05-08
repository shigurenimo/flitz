import { resolver } from "blitz"
import { TestNotificationService } from "integrations/application"
import { SessionAdapter } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const testNotification = resolver.pipe(
  resolver.zod(z.null()),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new SessionAdapter().getUserId(ctx.session),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(TestNotificationService).call({
      userId: input.userId,
    })

    return null
  }
)

export default testNotification
