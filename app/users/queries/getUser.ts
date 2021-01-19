import { Ctx, NotFoundError } from "blitz"
import { Id, Username, usernameSchema } from "domain/valueObjects"
import { UserRepository } from "integrations"
import * as z from "zod"

const inputSchema = z.object({ username: usernameSchema })

const getUser = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  const userId = Id.nullable(ctx.session.userId)

  const username = new Username(input.username)

  const user = await UserRepository.getUserByUsername({ userId, username })

  if (!user) {
    throw new NotFoundError()
  }

  return user
}

export default getUser
