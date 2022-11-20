import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { Id, Password } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { UpdateUserPasswordService } from "service"

const zUpdateAccountPassword = z.object({
  currentPassword: z.string(),
  password: z.string(),
})

const updateAccountPassword = resolver.pipe(
  resolver.zod(zUpdateAccountPassword),
  resolver.authorize(),
  (props, ctx) => {
    return {
      currentPassword: new Password(props.currentPassword),
      password: new Password(props.password),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const service = container.resolve(UpdateUserPasswordService)

    const result = await service.execute({
      currentPassword: props.currentPassword,
      password: props.password,
      userId: props.userId,
    })

    if (result instanceof Error) {
      throw result
    }

    return null
  }
)

export default withSentry(updateAccountPassword, "updateAccountPassword")
