import db from "db"
import { Id } from "integrations/domain"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class CountExchangesQuery {
  async execute(props: Props) {
    const count = await db.exchange.count({
      where: { userId: props.userId.value },
    })

    return count
  }
}
