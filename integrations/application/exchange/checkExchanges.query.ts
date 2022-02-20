import db from "db"
import { Id } from "integrations/domain"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class CheckExchangesQuery {
  async execute(props: Props) {
    const exchange = await db.exchange.findFirst({
      where: {
        messages: {
          some: {
            isRead: false,
            userId: { not: props.userId.value },
          },
        },
        userId: props.userId.value,
      },
    })

    return exchange !== null
  }
}
