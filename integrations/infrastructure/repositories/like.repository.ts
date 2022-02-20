import db from "db"
import { Id, LikeEntity } from "integrations/domain"

export class LikeRepository {
  async find(userId: Id, postId: Id) {
    await db.like.findUnique({
      where: {
        userId_postId: {
          userId: userId.value,
          postId: postId.value,
        },
      },
    })

    return null
  }

  async upsert(like: LikeEntity) {
    await db.post.update({
      data: {
        likes: {
          create: {
            id: like.id.value,
            userId: like.userId.value,
          },
        },
        likesCount: { increment: 1 },
      },
      where: { id: like.postId.value },
    })

    return null
  }

  async delete(like: LikeEntity) {
    await db.post.update({
      data: {
        likes: {
          delete: {
            userId_postId: {
              userId: like.userId.value,
              postId: like.postId.value,
            },
          },
        },
        likesCount: { decrement: 1 },
      },
      where: { id: like.postId.value },
    })

    return null
  }
}
