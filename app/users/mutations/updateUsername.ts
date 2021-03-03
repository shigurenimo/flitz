import { resolver } from "blitz"
import { UpdateUsernameService } from "integrations/application"
import { Id, Name, zName } from "integrations/domain"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const UpdateUsername = z.object({ username: zName })

export default resolver.pipe(
  resolver.zod(UpdateUsername),
  resolver.authorize(),
  (input, ctx) => ({
    userId: new Id(ctx.session.userId),
    username: new Name(input.username),
  }),
  async (input, ctx) => {
    const app = await createAppContext()

    await app.get(UpdateUsernameService).call({
      session: ctx.session,
      username: input.username,
      userId: input.userId,
    })

    return null
  }
)
