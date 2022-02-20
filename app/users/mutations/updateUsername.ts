import { resolver } from "blitz"
import { UpdateUsernameService } from "integrations/application"
import { Id, Name } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zUpdateUsername = z.object({ username: z.string() })

const updateUsername = resolver.pipe(
  resolver.zod(zUpdateUsername),
  resolver.authorize(),
  (props, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
      username: new Name(props.username),
    }
  },
  async (props, ctx) => {
    const updateUsernameService = container.resolve(UpdateUsernameService)

    const newUser = await updateUsernameService.execute({
      session: ctx.session,
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

export default updateUsername
