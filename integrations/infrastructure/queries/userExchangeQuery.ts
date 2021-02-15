import db from "db"
import { Count, Id, Skip } from "integrations/domain"

export class UserExchangeQuery {
  async count(input: { userId: Id }) {
    const count = await db.exchange.count({
      where: { userId: input.userId.value },
    })

    return new Count(count)
  }

  async checkExistence(input: { userId: Id }) {
    const exchange = await db.exchange.findFirst({
      where: {
        messages: {
          some: {
            isRead: false,
            userId: { not: input.userId.value },
          },
        },
        userId: input.userId.value,
      },
    })

    return exchange !== null
  }

  async findMany(input: { skip: Skip; userId: Id }) {
    const exchanges = await db.exchange.findMany({
      orderBy: { updatedAt: "desc" },
      skip: input.skip.value,
      take: 16,
      where: { userId: input.userId.value },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { user: true },
        },
        relatedUser: true,
      },
    })

    return exchanges
  }

  async find(input: { exchangeId: Id; skip: Skip }) {
    const exchange = await db.exchange.findUnique({
      include: {
        user: { include: { iconImage: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
          skip: input.skip.value,
        },
      },
      where: { id: input.exchangeId.value },
    })

    return exchange
  }
}
