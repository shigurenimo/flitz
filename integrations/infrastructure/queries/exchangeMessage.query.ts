import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id, Skip } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"

@Injectable()
export class ExchangeMessageQuery {
  constructor(private queryConverter: QueryConverter) {}

  async count(exchangeId: Id) {
    const count = await db.message.count({
      where: { id: exchangeId.value },
    })

    return new Count(count)
  }

  async findMany(input: { exchangeId: Id; skip: Skip }) {
    const exchange = await db.exchange.findUnique({
      include: {
        // user: { include: { iconImage: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
          skip: input.skip.value,
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

  async findManyByUserId(input: { relatedUserId: Id; skip: Skip; userId: Id }) {
    const messages = await db.message.findMany({
      include: {
        user: { include: { iconImage: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
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
