import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type Input = Pick<Prisma.FindManyPostArgs, "skip" | "take"> & {
  username: string | null
}

const getUserFolloweesInfinite = async ({ username, skip = 0, take }: Input, ctx: Ctx) => {
  if (username === null) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const friendships = await db.friendship.findMany({
    include: {
      followee: {
        include: {
          followees: userId ? { where: { followeeId: userId } } : false,
          followers: userId ? { where: { followerId: userId } } : false,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    where: { follower: { username } },
  })

  const count = await db.friendship.count({
    where: { follower: { username } },
  })

  const hasMore = typeof take === "number" ? skip + take < count : false

  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return { count, hasMore, friendships, nextPage }
}

export default getUserFolloweesInfinite
