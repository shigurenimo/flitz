import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class HasUnreadReferenceQuery {
  async execute(props: Props) {
    const reference = await db.reference.findFirst({
      where: {
        isRead: false,
        userId: props.userId.value,
      },
    })

    return reference !== null
  }
}
