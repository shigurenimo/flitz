import db from "db"
import { Username } from "integrations/domain"
import { injectable } from "tsyringe"

type Props = {
  username: Username
}

@injectable()
export class CountFolloweesQuery {
  async execute(props: Props) {
    const count = await db.friendship.count({
      where: { follower: { username: props.username.value } },
    })

    return count
  }
}
