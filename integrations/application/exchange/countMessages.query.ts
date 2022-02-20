import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

type Props = {
  exchangeId: Id
}

@injectable()
export class CountMessagesQuery {
  async execute(props: Props) {
    const count = await db.message.count({
      where: { id: props.exchangeId.value },
    })

    return count
  }
}
