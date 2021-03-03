import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id, Skip } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"

@Injectable()
export class UserExchangeQuery {
  constructor(private queryConverter: QueryConverter) {}

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
        },
        relatedUser: { include: { iconImage: true } },
      },
    })

    return exchanges.map((exchange) => {
      return this.queryConverter.toUserExchange(exchange)
    })
  }
}
