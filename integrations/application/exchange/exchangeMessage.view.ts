import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { ViewConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

@injectable()
export class ExchangeMessageQuery {
  constructor(private queryConverter: ViewConverter) {}

  async count(exchangeId: Id) {
    const count = await db.message.count({
      where: { id: exchangeId.value },
    })

    return count
  }

  async findMany(input: { exchangeId: Id; skip: number }) {
    const exchange = await db.exchange.findUnique({
      include: {
        // user: { include: { iconImage: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
          skip: input.skip,
          include: {
            user: { include: { iconImage: true } },
          },
        },
      },
      where: { id: input.exchangeId.value },
    })

    if (exchange === null) return null

    return exchange.messages.map((message) => {
      return this.queryConverter.toUserMessage(message)
    })
  }

  async findManyByUserId(input: {
    relatedUserId: Id
    skip: number
    userId: Id
  }) {
    const messages = await db.message.findMany({
      include: {
        user: { include: { iconImage: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip,
      take: 20,
      where: {
        exchanges: {
          some: { userId: input.userId.value },
        },
      },
    })

    return messages.map((message) => {
      return this.queryConverter.toUserMessage(message)
    })
  }
}
