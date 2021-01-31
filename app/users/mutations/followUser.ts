import { Ctx } from "blitz"
import { Id, idSchema } from "domain/valueObjects"
import {
  NotificationRepository,
  UserRepository,
} from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({ userId: idSchema })

const followUser = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  ctx.session.authorize()

  const { userId: followeeId } = inputSchema
    .transform((input) => ({
      userId: new Id(input.userId),
    }))
    .parse(input)

  const followerId = new Id(ctx.session.userId)

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

export default followUser
