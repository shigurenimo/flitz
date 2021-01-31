import { Ctx, NotFoundError } from "blitz"
import { Id, Username, usernameSchema } from "domain/valueObjects"
import { UserRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({ username: usernameSchema })

const getUser = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  const userId = Id.nullable(ctx.session.userId)

  const username = new Username(input.username)

  const userRepository = new UserRepository()

  const { user } = await userRepository.getUserByUsername({ userId, username })

  if (!user) {
    throw new NotFoundError()
  }

  return user
}

export default getUser
