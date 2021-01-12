import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetPostsInfiniteInput = Pick<Prisma.FindManyPostArgs, "skip" | "take">

const getPostsInfinite = async ({ skip = 0, take }: GetPostsInfiniteInput, ctx: Ctx) => {
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
  })

  const count = await db.post.count()

  const hasMore = typeof take === "number" ? skip + take < count : false

  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return { hasMore, posts, nextPage }
}

export default getPostsInfinite
