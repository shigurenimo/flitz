import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetRepliesInput = Pick<Prisma.FindManyPostArgs, "skip" | "take"> & {
  where: { replyId: string }
}

const getRepliesInfinite = async ({ where, skip = 0, take }: GetRepliesInput, ctx: Ctx) => {
  const userId = ctx.session.userId

  const posts = await db.post.findMany({
    include: {
      likes: userId ? { where: { userId } } : false,
      quotations: userId ? { where: { userId } } : false,
      replies: userId ? { where: { userId } } : false,
      user: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    where: { replyId: where.replyId },
  })

  const count = await db.post.count({ where: { replyId: where.replyId } })

  const hasMore = typeof take === "number" ? skip + take < count : false

  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return { hasMore, posts, nextPage }
}

export default getRepliesInfinite
