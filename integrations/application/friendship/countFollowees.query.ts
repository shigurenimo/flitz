import db from "db"
import { Username } from "integrations/domain"
import { injectable } from "tsyringe"

@injectable()
export class CountFolloweesQuery {
  async execute(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { follower: { username: input.username.value } },
    })

    return count
  }
}
