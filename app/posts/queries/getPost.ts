import { NotFoundError } from "blitz"
import db from "db"

type GetIssueInput = {
  where: { id?: string }
}

const getPost = async ({ where }: GetIssueInput) => {
  if (!where.id) {
    throw new NotFoundError()
  }

  const post = await db.post.findUnique({
    include: { user: true },
    where: { id: where.id },
  })

  if (!post) {
    throw new NotFoundError()
  }

  return post
}

export default getPost
