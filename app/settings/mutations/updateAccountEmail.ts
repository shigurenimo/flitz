import { resolver } from "blitz"
import { UpdateAccountEmailService } from "integrations/application"
import { Email, Id, zEmail } from "integrations/domain"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const zUpdateAccountEmailMutation = z.object({ email: zEmail })

export default resolver.pipe(
  resolver.zod(zUpdateAccountEmailMutation),
  resolver.authorize(),
  (input, ctx) => ({
    email: new Email(input.email),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(UpdateAccountEmailService).call({
      email: input.email,
      userId: input.userId,
    })

    return null
  }
)
