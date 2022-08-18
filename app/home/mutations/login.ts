import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { withSentry } from "app/core/utils/withSentry"
import { zLoginMutation } from "app/home/validations/loginMutation"
import { LoginService } from "integrations/application"
import { Email, Password, UserRoleFactory } from "integrations/domain"

const login = resolver.pipe(
  resolver.zod(zLoginMutation),
  (props) => {
    return {
      email: new Email(props.email),
      password: new Password(props.password),
    }
  },
  async (props, ctx) => {
    const loginService = container.resolve(LoginService)

    const user = await loginService.execute({
      password: props.password,
      email: props.email,
    })

    if (user instanceof Error) {
      throw user
    }

    await ctx.session.$create({
      iconImageId: user.iconImageId?.value || null,
      name: user.name?.value || null,
      role: UserRoleFactory.user().value,
      userId: user.id.value,
      username: user.username.value,
    })

    return null
  }
)

export default withSentry(login, "login")
