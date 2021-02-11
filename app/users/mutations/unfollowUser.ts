import { resolver } from "blitz"
import { Id, idSchema } from "integrations/domain/valueObjects"
import { UserRepository } from "integrations/infrastructure/repositories"
import * as z from "zod"

const UnfollowUser = z.object({ userId: idSchema })

export default resolver.pipe(
  resolver.zod(UnfollowUser),
  resolver.authorize(),
  (input, ctx) => ({
    followeeId: new Id(input.userId),
    followerId: new Id(ctx.session.userId),
  }),
  async ({ followeeId, followerId }) => {
    if (followerId.value === followeeId.value) {
      throw new Error("Unexpected error")
    }

    const userRepository = new UserRepository()

    const { user } = await userRepository.unfollowUser({
      followeeId,
      followerId,
    })

    return user
  }
)
