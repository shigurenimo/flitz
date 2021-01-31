import { Ctx } from "blitz"
import { Name, nameSchema } from "domain/valueObjects"
import { SessionRepository, UserRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({ username: nameSchema })

const updateUsername = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  ctx.session.authorize()

  const { username } = inputSchema
    .transform((input) => ({ username: new Name(input.username) }))
    .parse(input)

  const sessionRepository = new SessionRepository()

  const userId = sessionRepository.getUserId(ctx.session)

  const userRepository = new UserRepository()

  const { user, userEntity } = await userRepository.updateUsername({
    username,
    id: userId,
  })

  await sessionRepository.updatePublicData(ctx.session, {
    name: userEntity.name,
    username: userEntity.username,
    iconImageId: userEntity.iconImage?.id || null,
  })

  return user
}

export default updateUsername
