import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type Input = Pick<Prisma.FindManyExchangeArgs, "skip" | "take"> & {
  relatedUserId?: string
}

const getMessagesInfinite = async ({ skip, take, ...input }: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!input.relatedUserId) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const messages = await db.message.findMany({
    include: {
      user: true,
      exchanges: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: 20,
    where: {
      exchanges: {
        some: {
          userId,
          relatedUsers: { every: { id: input.relatedUserId } },
        },
      },
    },
  })

  const unreadMessages = messages.filter((message) => {
    if (message.userId === userId) return false
    for (const exchange of message.exchanges) {
      if (exchange.relatedUserId === null) continue
      if (exchange.userId !== userId) continue
      return !message.isRead
    }
    return false
  })

  if (unreadMessages.length > 0) {
    await db.message.updateMany({
      data: { isRead: true },
      where: {
        exchanges: {
          some: {
            userId,
            relatedUserId: input.relatedUserId,
            isRead: false,
          },
        },
      },
    })
  }

  const count = await db.message.count({
    where: {
      exchanges: {
        some: {
          userId,
          relatedUserId: input.relatedUserId,
        },
      },
    },
  })

  const hasMore = skip! + take! < count

  const nextPage = hasMore ? { take, skip: skip! + take! } : null

  return { messages, nextPage }
}

export default getMessagesInfinite
