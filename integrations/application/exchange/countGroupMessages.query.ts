import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  relatedUserId: Id
}

@injectable()
export class CountGroupMessagesQuery {
  async execute(props: Props) {
    const count = await db.message.count({
      where: {
        exchanges: {
          some: {
            userId: props.userId.value,
            relatedUserId: props.relatedUserId.value,
          },
        },
      },
    })

    return count
  }
}
