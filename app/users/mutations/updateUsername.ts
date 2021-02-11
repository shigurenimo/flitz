import { resolver } from "blitz"
import { Id, Name, nameSchema } from "integrations/domain"
import { SessionRepository, UserRepository } from "integrations/infrastructure"
import * as z from "zod"

const UpdateUsername = z.object({ username: nameSchema })

export default resolver.pipe(
  resolver.zod(UpdateUsername),
  resolver.authorize(),
  (input, ctx) => ({
    userId: new Id(ctx.session.userId),
    username: new Name(input.username),
  }),
  async ({ userId, username }, ctx) => {
    const userRepository = new UserRepository()

    const { user, userEntity } = await userRepository.updateUsername({
      username,
      id: userId,
    })

    const sessionRepository = new SessionRepository()

    await sessionRepository.updatePublicData(ctx.session, {
      name: userEntity.name,
      username: userEntity.username,
      iconImageId: userEntity.iconImage?.id || null,
    })

    return user
  }
)
