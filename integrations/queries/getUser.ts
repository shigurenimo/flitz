import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { FindUserByUsernameQuery } from "application"
import { Id, Username } from "core"
import { withSentry } from "interface/core/utils/withSentry"

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
    const query = container.resolve(FindUserByUsernameQuery)

    const user = await query.execute({
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
