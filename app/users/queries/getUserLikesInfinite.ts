import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type Input = Pick<Prisma.FindManyPostArgs, "skip" | "take"> & {
  username: string | null
}

const getUserLikesInfinite = async ({ username, skip = 0, take }: Input, ctx: Ctx) => {
  if (username === null) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const likes = await db.like.findMany({
    include: {
      post: {
        include: {
          likes: userId ? { where: { userId } } : false,
          quotation: {
            include: {
              likes: userId ? { where: { userId } } : false,
              quotations: userId ? { where: { userId } } : false,
              replies: userId ? { where: { userId } } : false,
              user: true,
            },
          },
          quotations: userId ? { where: { userId } } : false,
          replies: userId ? { where: { userId } } : false,
          reply: {
            include: {
              likes: userId ? { where: { userId } } : false,
              quotations: userId ? { where: { userId } } : false,
              replies: userId ? { where: { userId } } : false,
              user: true,
            },
          },
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    where: { user: { username } },
  })

  const count = await db.like.count({ where: { user: { username } } })

  const hasMore = typeof take === "number" ? skip + take < count : false

  const nextPage = hasMore ? { take, skip: skip + take! } : false

  const isEmpty = likes.length === 0

  return { count, likes, nextPage, hasMore, isEmpty }
}

export default getUserLikesInfinite
