import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { UpdateUsernameService } from "application"
import { Id, Username } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zProps = z.object({ username: z.string() })

const updateUsername = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
      username: new Username(props.username),
    }
  },
  async (props, ctx) => {
    const service = container.resolve(UpdateUsernameService)

    const user = await service.execute({
      username: props.username,
      userId: props.userId,
    })

    if (user instanceof Error) {
      throw user
    }

    await ctx.session.$setPublicData({
      name: user.name?.value ?? null,
      username: user.username.value,
      iconImageId: user.iconImageId?.value ?? null,
    })

    return null
  }
)

export default withSentry(updateUsername, "updateUsername")
