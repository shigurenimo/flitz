import { resolver } from "blitz"
import { Id, idSchema } from "integrations/domain/valueObjects"
import {
  NotificationRepository,
  UserRepository,
} from "integrations/infrastructure/repositories"
import * as z from "zod"

const FollowUser = z.object({ userId: idSchema })

export default resolver.pipe(
  resolver.zod(FollowUser),
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

    const { user, userEntity } = await userRepository.followUser({
      followeeId,
      followerId,
    })

    const [friendship] = userEntity.followers

    const notificationRepository = new NotificationRepository()

    await notificationRepository.upsertFollowNotification({
      followeeId,
      followerId,
      friendshipId: friendship.id,
    })

    return user
  }
)
