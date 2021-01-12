import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = { postId: string }

const deletePostLike = async (input: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!input.postId) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const updated = await db.post.update({
    data: {
      likes: {
        delete: {
          userId_postId: {
            userId: ctx.session.userId,
            postId: input.postId,
          },
        },
      },
      references: {
        update: {
          data: { hasLike: false },
          where: {
            userId_postId: {
              userId,
              postId: input.postId,
            },
          },
        },
      },
      likesCount: { decrement: 1 },
    },
    where: { id: input.postId },
  })

  return updated
}

export default deletePostLike
