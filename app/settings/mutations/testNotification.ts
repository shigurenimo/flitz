import { resolver } from "blitz"
import { TestNotificationService } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.null()

const testNotification = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (input) => {
    const testNotificationService = container.resolve(TestNotificationService)

    await testNotificationService.execute({
      userId: input.userId,
    })

    return null
  }
)

export default testNotification
