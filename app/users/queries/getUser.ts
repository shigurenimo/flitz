import { NotFoundError, resolver } from "blitz"
import { Id, Username, zUsername } from "integrations/domain"
import { UserQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetUser = z.object({ username: zUsername })

export default resolver.pipe(
  resolver.zod(GetUser),
  (input, ctx) => ({
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ userId, username }) => {
    const app = await createAppContext()

    const user = await app.get(UserQuery).findByUsername(username, userId)

    if (!user) {
      throw new NotFoundError()
    }

    return user
  }
)
