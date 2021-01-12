import { Ctx } from "blitz"
import db, { Prisma } from "db"

type Input = Pick<Prisma.FindManyExchangeArgs, "orderBy" | "skip" | "take">

const getExchanges = async ({ orderBy, skip = 0, take }: Input, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = ctx.session.userId

  const exchanges = await db.exchange.findMany({
    orderBy,
    skip,
    take,
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { user: true },
      },
      relatedUser: true,
    },
  })

  const count = await db.exchange.count({ where: { userId } })

  const hasMore = typeof take === "number" ? skip + take < count : false

  const nextPage = hasMore ? { take, skip: skip + take! } : null

  const isEmpty = exchanges.length === 0

  return { isEmpty, nextPage, exchanges, hasMore, count }
}

export default getExchanges
