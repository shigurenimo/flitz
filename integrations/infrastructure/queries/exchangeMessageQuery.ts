import db from "db"
import { Count, Id, Skip } from "integrations/domain/valueObjects"

export class ExchangeMessageQuery {
  async count(input: { exchangeId: Id }) {
    const count = await db.message.count({
      where: { id: input.exchangeId.value },
    })

    return new Count(count)
  }

  async findMany(input: { exchangeId: Id; skip: Skip }) {
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

    if (exchange === null) return null

    return exchange.messages
  }

  async findManyByUserId(input: { relatedUserId: Id; skip: Skip; userId: Id }) {
    const messages = await db.message.findMany({
      include: {
        user: true,
        exchanges: true,
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 20,
      where: {
        exchanges: {
          some: {
            userId: input.userId.value,
            relatedUsers: { every: { id: input.relatedUserId.value } },
          },
        },
      },
    })

    return messages
  }
}
