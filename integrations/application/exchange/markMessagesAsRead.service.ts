import db from "db"
import { Id } from "integrations/domain"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  relatedUserId: Id
}

@injectable()
export class MarkMessagesAsReadService {
  async execute(props: Props) {
    await db.message.updateMany({
      data: { isRead: true },
      where: {
        exchanges: {
          some: {
            userId: props.relatedUserId.value,
            relatedUserId: props.userId.value,
            isRead: false,
          },
        },
      },
    })

    return null
  }
}
