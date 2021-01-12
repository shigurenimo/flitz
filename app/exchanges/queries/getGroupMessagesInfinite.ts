import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type Input = Pick<Prisma.FindManyExchangeArgs, "skip" | "take"> & {
  exchangeId: string
}

const getExchangeMessagesInfinite = async ({ skip, take, ...input }: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!input.exchangeId) {
    throw new NotFoundError()
  }

  const exchange = await db.exchange.findUnique({
    include: {
      user: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 20,
        skip,
      },
    },
    where: { id: input.exchangeId },
  })

  if (exchange === null) {
    throw new NotFoundError()
  }

  const messages = exchange.messages

  const count = await db.message.count({
    where: { id: input.exchangeId },
  })

  const hasMore = skip! + take! < count

  const nextPage = hasMore ? { take, skip: skip! + take! } : null

  return { messages, nextPage }
}

export default getExchangeMessagesInfinite
