import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { LoginService } from "application"
import { Email, Password, UserRoleFactory } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zLoginMutation } from "interface/home/validations/loginMutation"

const login = resolver.pipe(
  resolver.zod(zLoginMutation),
  (props) => {
    return {
      email: new Email(props.email),
      password: new Password(props.password),
    }
  },
  async (props, ctx) => {
    const service = container.resolve(LoginService)

    const user = await service.execute({
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
