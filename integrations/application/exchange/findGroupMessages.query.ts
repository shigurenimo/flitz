import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  exchangeId: Id
  skip: number
}

@injectable()
export class FindGroupMessagesQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    const exchange = await db.exchange.findUnique({
      include: {
        // user: { include: { iconImage: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
          skip: props.skip,
          include: {
            user: { include: { iconImage: true } },
          },
        },
      },
      where: { id: props.exchangeId.value },
    })

    if (exchange === null) return null

    return exchange.messages.map((message) => {
      return this.queryConverter.toUserMessage(message)
    })
  }
}
