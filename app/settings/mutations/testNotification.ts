import { resolver } from "blitz"
import { TestNotificationService } from "integrations/application"
import { SessionRepository } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.null()),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new SessionRepository().getUserId(ctx.session),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(TestNotificationService).call({
      userId: input.userId,
    })

    return null
  }
)
