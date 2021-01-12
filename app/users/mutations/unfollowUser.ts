import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = { userId?: string }

const unfollowUser = async ({ userId }: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!userId) {
    throw new NotFoundError()
  }

  const [user] = await db.$transaction([
    db.user.update({
      data: {
        followers: {
          delete: {
            followerId_followeeId: {
              followerId: ctx.session.userId,
              followeeId: userId,
            },
          },
        },
        followersCount: { decrement: 1 },
      },
      include: {
        followers: { where: { followerId: ctx.session.userId } },
      },
      where: { id: userId },
    }),
    db.user.update({
      data: {
        followeesCount: { decrement: 1 },
      },
      where: { id: ctx.session.userId },
    }),
  ])

  return user
}

export default unfollowUser
