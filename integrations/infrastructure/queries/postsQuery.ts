import db from "db"
import { Count, Id } from "integrations/domain"

export class PostQuery {
  async count() {
    const count = await db.post.count()

    return new Count(count)
  }

  async find(input: { id: Id }) {
    const post = await db.post.findUnique({
      include: {
        files: true,
        user: { include: { iconImage: true } },
      },
      where: { id: input.id.value },
    })

    return post
  }
}
