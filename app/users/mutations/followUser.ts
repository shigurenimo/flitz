import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = { userId?: string }

const followUser = async (input: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!input.userId) {
    throw new NotFoundError()
  }

  if (ctx.session.userId === input.userId) {
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
      where: { id: input.userId },
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
      uniqueId: ctx.session.userId,
      user: { connect: { id: input.userId } },
    },
    update: {
      friendship: { connect: { id: friendship.id } },
    },
    where: {
      userId_type_uniqueId: {
        type: "FRIENDSHIP",
        uniqueId: ctx.session.userId,
        userId: input.userId,
      },
    },
  })

  return user
}

export default followUser
