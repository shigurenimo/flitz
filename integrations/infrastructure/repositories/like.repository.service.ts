import db from "db"
import { Id, LikeEntity, LikeRepository } from "integrations/domain"

export class LikeRepositoryService extends LikeRepository {
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

  async upsert(likeEntity: LikeEntity) {
    await db.post.update({
      data: {
        likes: {
          create: {
            id: likeEntity.id.value,
            userId: likeEntity.userId.value,
          },
        },
        likesCount: { increment: 1 },
      },
      where: { id: likeEntity.postId.value },
    })

    return null
  }

  async delete(likeEntity: LikeEntity) {
    await db.post.update({
      data: {
        likes: {
          delete: {
            userId_postId: {
              userId: likeEntity.userId.value,
              postId: likeEntity.postId.value,
            },
          },
        },
        likesCount: { decrement: 1 },
      },
      where: { id: likeEntity.postId.value },
    })

    return null
  }
}
