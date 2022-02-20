import { NotFoundError, resolver } from "blitz"
import { UserQuery } from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetUser = z.object({ username: z.string() })

const getUser = resolver.pipe(
  resolver.zod(zGetUser),
  (props, ctx) => {
    return {
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
      username: new Username(props.username),
    }
  },
  async (props) => {
    const userQuery = container.resolve(UserQuery)

    const user = await userQuery.findByUsername(props.username, props.userId)

    if (user === null) {
      throw new NotFoundError()
    }

    return user
  }
)

export default getUser
