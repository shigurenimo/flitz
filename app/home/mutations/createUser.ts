import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { withSentry } from "app/core/utils/withSentry"
import { zCreateUserMutation } from "app/home/validations/createUserMutation"
import { SignUpService } from "integrations/application"
import { Email, Password, UserRoleFactory } from "integrations/domain"

const createUser = resolver.pipe(
  resolver.zod(zCreateUserMutation),
  (props) => {
    return {
      email: new Email(props.email),
      password: new Password(props.password),
    }
  },
  async (props, ctx) => {
    const signUpService = container.resolve(SignUpService)

    const user = await signUpService.execute({
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
