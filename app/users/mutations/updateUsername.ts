import { Ctx } from "blitz"
import { Id, Name, nameSchema, Username } from "domain/valueObjects"
import { SessionRepository, UserRepository } from "infrastructure"
import * as z from "zod"

const inputSchema = z.object({ username: nameSchema })

const updateUsername = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  ctx.session.authorize()

  const { username } = inputSchema
    .transform((input) => ({ username: new Name(input.username) }))
    .parse(input)

  const userId = SessionRepository.getUserId(ctx.session)

  const user = await UserRepository.updateUsername({ username, id: userId })

  await SessionRepository.updatePublicData(ctx.session, {
    name: Name.nullable(user.name),
    username: new Username(user.username),
    iconImageId: user.iconImage ? new Id(user.iconImage.id) : null,
  })

  return user
}

export default updateUsername
