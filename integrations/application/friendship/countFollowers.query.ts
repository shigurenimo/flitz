import db from "db"
import { Username } from "integrations/domain"
import { injectable } from "tsyringe"

type Props = {
  username: Username
}

@injectable()
export class CountFollowersQuery {
  async count(props: Props) {
    const count = await db.friendship.count({
      where: { followee: { username: props.username.value } },
    })

    return count
  }
}
