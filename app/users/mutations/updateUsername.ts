import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import { UpdateUsernameService } from "integrations/application"
import { Id, Username } from "integrations/domain"

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
    const updateUsernameService = container.resolve(UpdateUsernameService)

    const newUser = await updateUsernameService.execute({
      username: props.username,
      userId: props.userId,
    })

    if (newUser instanceof Error) {
      throw newUser
    }

    await ctx.session.$setPublicData({
      name: newUser.name?.value ?? null,
      username: newUser.username.value,
      iconImageId: newUser.iconImageId?.value ?? null,
    })

    return null
  }
)

export default withSentry(updateUsername, "updateUsername")
