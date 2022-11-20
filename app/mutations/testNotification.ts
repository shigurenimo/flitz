import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { TestNotificationService } from "service"

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
    const service = container.resolve(TestNotificationService)

    const result = await service.execute({
      userId: props.userId,
    })

    if (result instanceof Error) {
      throw result
    }

    return null
  }
)

export default withSentry(testNotification, "testNotification")
