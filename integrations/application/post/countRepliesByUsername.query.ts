import db from "db"
import { Username } from "integrations/domain/valueObjects"
import { injectable } from "tsyringe"

type Props = {
  username: Username
}

@injectable()
export class CountRepliesByUsernameQuery {
  async count(props: Props) {
    const count = await db.post.count({
      where: {
        user: { username: props.username.value },
        replyId: { not: null },
      },
    })

    return count
  }
}
