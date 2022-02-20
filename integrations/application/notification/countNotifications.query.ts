import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class CountNotificationsQuery {
  async execute(props: Props) {
    const count = await db.notification.count({
      where: { userId: props.userId.value },
    })

    return count
  }
}
