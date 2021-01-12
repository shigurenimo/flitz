import { Ctx, NotFoundError } from "blitz"
import db from "db"

type GetUserInput = {
  where: { username?: string }
}

const getUser = async ({ where }: GetUserInput, ctx: Ctx) => {
  if (!where.username) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const user = await db.user.findUnique({
    include: {
      followers: userId ? { where: { followerId: userId } } : false,
    },
    where: { username: where.username },
  })

  if (!user) {
    throw new NotFoundError()
  }

  return user
}

export default getUser
