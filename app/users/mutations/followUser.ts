import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = { userId?: string }

const followUser = async ({ userId }: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!userId) {
    throw new NotFoundError()
  }

  if (ctx.session.userId === userId) {
    throw new Error("Unexpected error")
  }

  const [user] = await db.$transaction([
    db.user.update({
      data: {
        followers: {
          create: {
            follower: { connect: { id: ctx.session.userId } },
          },
        },
        followersCount: { increment: 1 },
      },
      include: {
        followers: { where: { followerId: ctx.session.userId } },
      },
      where: { id: userId },
    }),
    db.user.update({
      data: { followeesCount: { increment: 1 } },
      where: { id: ctx.session.userId },
    }),
  ])

  const [friendship] = user.followers

  await db.notification.upsert({
    create: {
      friendship: { connect: { id: friendship.id } },
      type: "FRIENDSHIP",
      uniqueId: friendship.followeeId,
      user: { connect: { id: userId } },
    },
    update: {},
    where: {
      userId_type_uniqueId: {
        type: "FRIENDSHIP",
        uniqueId: friendship.followeeId,
        userId,
      },
    },
  })

  return user
}

export default followUser
