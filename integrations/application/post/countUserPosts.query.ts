import db from "db"
import { Username } from "integrations/domain"
import { injectable } from "tsyringe"

type Props = {
  username: Username
}

@injectable()
export class CountUserPostsQuery {
  async execute(props: Props) {
    const count = await db.post.count({
      where: { user: { username: props.username.value } },
    })

    return count
  }
}
