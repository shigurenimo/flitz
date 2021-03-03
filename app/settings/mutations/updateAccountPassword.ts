import { resolver } from "blitz"
import { UpdateAccountPasswordService } from "integrations/application"
import { Id, Password, zPassword } from "integrations/domain"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const zUpdateAccountPassword = z.object({
  currentPassword: zPassword,
  password: zPassword,
})

export default resolver.pipe(
  resolver.zod(zUpdateAccountPassword),
  resolver.authorize(),
  (input, ctx) => ({
    currentPassword: new Password(input.currentPassword),
    password: new Password(input.password),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(UpdateAccountPasswordService).call({
      currentPassword: input.currentPassword,
      password: input.password,
      userId: input.userId,
    })

    return null
  }
)
