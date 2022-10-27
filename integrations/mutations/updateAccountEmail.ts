import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { UpdateUserEmailService } from "application"
import { Email, Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zUpdateAccountEmailMutation = z.object({ email: z.string() })

const updateAccountEmail = resolver.pipe(
  resolver.zod(zUpdateAccountEmailMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      email: new Email(props.email),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const service = container.resolve(UpdateUserEmailService)

    const result = await service.execute({
      email: props.email,
      userId: props.userId,
    })

    if (result instanceof Error) {
      throw result
    }

    return null
  }
)

export default withSentry(updateAccountEmail, "updateAccountEmail")
