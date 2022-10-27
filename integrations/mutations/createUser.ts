import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { SignUpService } from "application"
import { Email, Password, UserRoleFactory } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zCreateUserMutation } from "interface/home/validations/createUserMutation"

const createUser = resolver.pipe(
  resolver.zod(zCreateUserMutation),
  (props) => {
    return {
      email: new Email(props.email),
      password: new Password(props.password),
    }
  },
  async (props, ctx) => {
    const service = container.resolve(SignUpService)

    const user = await service.execute({
      password: props.password,
      email: props.email,
    })

    if (user instanceof Error) {
      throw user
    }

    await ctx.session.$create({
      name: user.name?.value ?? null,
      role: UserRoleFactory.user().value,
      userId: user.id.value,
      username: user.username?.value ?? null,
      iconImageId: null,
    })

    return null
  }
)

export default withSentry(createUser, "createUser")
