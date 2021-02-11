import { NotFoundError, resolver } from "blitz"
import { Id, Username, usernameSchema } from "integrations/domain/valueObjects"
import { UserRepository } from "integrations/infrastructure/repositories"
import * as z from "zod"

const GetUser = z.object({ username: usernameSchema })

export default resolver.pipe(
  resolver.zod(GetUser),
  (input, ctx) => ({
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ userId, username }) => {
    const userRepository = new UserRepository()

    const { user } = await userRepository.getUserByUsername({
      userId,
      username,
    })

    if (!user) {
      throw new NotFoundError()
    }

    return user
  }
)
