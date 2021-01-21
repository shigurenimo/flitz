import { Ctx } from "blitz"
import { Id, idSchema } from "domain/valueObjects"
import { NotificationRepository, UserRepository } from "infrastructure"
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

  const user = await UserRepository.followUser({ followeeId, followerId })

  const [friendship] = user.followers

  await NotificationRepository.upsertFollowNotification({
    followeeId,
    followerId,
    friendshipId: new Id(friendship.id),
  })

  return user
}

export default followUser
