import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class HasUnreadNotificationQuery {
  async execute(props: Props) {
    const notification = await db.notification.findFirst({
      where: {
        isRead: false,
        userId: props.userId.value,
      },
    })

    return notification !== null
  }
}
