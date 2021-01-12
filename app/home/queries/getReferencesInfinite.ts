import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetIssuesInput = Pick<Prisma.FindManyPostArgs, "skip" | "take">

const getReferencesInfinite = async ({ skip = 0, take }: GetIssuesInput, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = ctx.session.userId

  const references = await db.reference.findMany({
    include: {
      post: {
        include: {
          likes: { where: { userId } },
          quotation: {
            include: {
              likes: { where: { userId } },
              quotations: { where: { userId } },
              replies: { where: { userId } },
              user: true,
            },
          },
          quotations: { where: { userId } },
          replies: { where: { userId } },
          reply: {
            include: {
              likes: { where: { userId } },
              quotations: { where: { userId } },
              replies: { where: { userId } },
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
    where: { userId },
  })

  const unreadReferences = references.filter((reference) => {
    return !reference.isRead
  })

  if (unreadReferences.length > 0) {
    await db.reference.updateMany({
      data: { isRead: true },
      where: {
        userId,
        isRead: false,
      },
    })
  }

  const count = await db.post.count({ where: { userId } })

  const hasMore = typeof take === "number" ? skip + take < count : false

  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return { hasMore, references, nextPage }
}

export default getReferencesInfinite
