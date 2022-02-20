import db from "db"
import { injectable } from "tsyringe"

@injectable()
export class CountPostsQuery {
  async execute() {
    const count = await db.post.count({})

    return count
  }
}
