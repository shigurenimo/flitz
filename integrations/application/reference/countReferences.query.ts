import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class CountReferencesQuery {
  async execute(props: Props) {
    const count = await db.post.count({ where: { userId: props.userId.value } })

    return count
  }
}
