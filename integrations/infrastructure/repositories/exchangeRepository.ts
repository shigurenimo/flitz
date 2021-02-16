import db from "db"
import { IExchangeRepository } from "integrations/domain/repositories"
import { Id, PostText } from "integrations/domain/valueObjects"
import { PrismaAdapter } from "integrations/infrastructure/adapters"

export class ExchangeRepository implements IExchangeRepository {
  prismaAdapter: PrismaAdapter

  constructor() {
    this.prismaAdapter = new PrismaAdapter()
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
