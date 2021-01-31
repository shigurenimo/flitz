import db from "db"
import { IExchangeRepository } from "domain/repositories"
import { Count, Id, PostText, Skip } from "domain/valueObjects"
import { PrismaAdapter } from "infrastructure/adapters"

export class ExchangeRepository implements IExchangeRepository {
  prismaAdapter: PrismaAdapter

  constructor() {
    this.prismaAdapter = new PrismaAdapter()
  }

  async countUserExchanges(input: { userId: Id }) {
    const count = await db.exchange.count({
      where: { userId: input.userId.value },
    })

    return new Count(count)
  }

  async getExchange(input: { exchangeId: Id; skip: Skip }) {
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

    const exchangeEntity = this.prismaAdapter.toExchangeEntity(exchange)

    return { exchange, exchangeEntity }
  }

  async getUserExchange(input: { userId: Id }) {
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

    const exchangeEntity = this.prismaAdapter.toExchangeEntity(exchange)

    return { exchange, exchangeEntity }
  }

  async getUserExchanges(input: { skip: Skip; userId: Id }) {
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

    const exchangeEntities = exchanges.map((exchange) => {
      return this.prismaAdapter.toExchangeEntity(exchange)
    })

    return { exchanges, exchangeEntities }
  }

  async createExchangeMessage(input: {
    text: PostText
    userId: Id
    exchangeId: Id
  }) {
    const exchange = await db.exchange.update({
      data: {
        messages: {
          create: {
            text: input.text.value,
            user: { connect: { id: input.userId.value } },
          },
        },
      },
      include: { messages: true },
      where: { id: input.exchangeId.value },
    })

    const exchangeEntity = this.prismaAdapter.toExchangeEntity(exchange)

    return { exchange, exchangeEntity }
  }
}
