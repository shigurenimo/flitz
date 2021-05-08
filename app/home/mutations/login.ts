import { zLoginMutation } from "app/home/validations/loginMutation"
import { resolver } from "blitz"
import { LoginService } from "integrations/application/authenticateUser.service"
import { Email, Password } from "integrations/domain"
import { createAppContext } from "integrations/registry"

const login = resolver.pipe(
  resolver.zod(zLoginMutation),
  (input) => ({
    email: new Email(input.email),
    password: new Password(input.password),
  }),
  async (input, ctx) => {
    const app = await createAppContext()

    const login = await app.get(LoginService).call({
      session: ctx.session,
      password: input.password,
      email: input.email,
    })

    if (login instanceof Error) {
      throw login
    }

    return null
  }
)

export default login
