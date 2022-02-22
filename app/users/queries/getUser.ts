import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { FindUserByUsernameQuery } from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({
  username: z.string(),
})

const getUser = resolver.pipe(
  resolver.zod(zProps),
  (props, ctx) => {
    return {
      loginId: ctx.session.userId ? new Id(ctx.session.userId) : null,
      username: new Username(props.username),
    }
  },
  async (props) => {
    const findUserByUsernameQuery = container.resolve(FindUserByUsernameQuery)

    const user = await findUserByUsernameQuery.execute({
      username: props.username,
      loginId: props.loginId,
    })

    if (user instanceof Error) {
      throw user
    }

    return user
  }
)

export default withSentry(getUser, "getUser")
