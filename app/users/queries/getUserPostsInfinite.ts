import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type Input = Pick<Prisma.FindManyPostArgs, "skip" | "take"> & {
  username: string | null
}

const getUserPostsInfinite = async ({ username, skip = 0, take }: Input, ctx: Ctx) => {
  if (username === null) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const posts = await db.post.findMany({
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
    orderBy: { createdAt: "desc" },
    skip,
    take,
    where: { user: { username } },
  })

  const count = await db.post.count({ where: { user: { username } } })

  const hasMore = typeof take === "number" ? skip + take < count : false

  const nextPage = hasMore ? { take, skip: skip + take! } : null

  const isEmpty = posts.length === 0

  return { count, posts, nextPage, hasMore, isEmpty }
}

export default getUserPostsInfinite
