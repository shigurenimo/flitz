import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import { TestNotificationService } from "integrations/application"
import { Id } from "integrations/domain"

const zProps = z.null()

const testNotification = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const testNotificationService = container.resolve(TestNotificationService)

    const transaction = await testNotificationService.execute({
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(testNotification, "testNotification")
