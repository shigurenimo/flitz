import { zCreateUserMutation } from "app/home/validations/createUserMutation"
import { resolver } from "blitz"
import { SignUpService } from "integrations/application"
import { Email, Password } from "integrations/domain"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(
  resolver.zod(zCreateUserMutation),
  (input) => ({
    email: new Email(input.email),
    password: new Password(input.password),
  }),
  async (input, ctx) => {
    const app = await createAppContext()

    const signUp = await app.get(SignUpService).call({
      session: ctx.session,
      password: input.password,
      email: input.email,
    })

    if (signUp instanceof Error) {
      throw signUp
    }

    return null
  }
)
