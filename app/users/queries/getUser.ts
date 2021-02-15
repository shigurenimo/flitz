import { NotFoundError, resolver } from "blitz"
import { Id, Username, usernameSchema } from "integrations/domain"
import { UserQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetUser = z.object({ username: usernameSchema })

export default resolver.pipe(
  resolver.zod(GetUser),
  (input, ctx) => ({
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ userId, username }) => {
    const userQuery = new UserQuery()

    const user = await userQuery.findByUsername({
      userId,
      username,
    })

    if (!user) {
      throw new NotFoundError()
    }

    return user
  }
)
