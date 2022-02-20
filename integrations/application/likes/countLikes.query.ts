import db from "db"
import { Username } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

type Props = {
  username: Username
}

@injectable()
export class CountLikesQuery {
  async execute(props: Props) {
    const count = await db.like.count({
      where: { user: { username: props.username.value } },
    })

    return count
  }
}
