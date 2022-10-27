import { captureException } from "@sentry/node"
import { Id, LikeEntity } from "core"
import db from "db"

export class LikeRepository {
  async find(userId: Id, postId: Id) {
    try {
      await db.like.findUnique({
        where: {
          userId_postId: {
            userId: userId.value,
            postId: postId.value,
          },
        },
      })

      return null
    } catch (error) {
      captureException(error, { level: "fatal" })
      if (error instanceof Error) {
        return new Error(error.message)
      }
      return new Error()
    }
  }

  async upsert(like: LikeEntity) {
    try {
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
    } catch (error) {
      captureException(error, { level: "fatal" })
      if (error instanceof Error) {
        return new Error(error.message)
      }
      return new Error()
    }
  }

  async delete(like: LikeEntity) {
    try {
      await db.post.update({
        where: { id: like.postId.value },
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
      })

      return null
    } catch (error) {
      captureException(error, { level: "fatal" })
      if (error instanceof Error) {
        return new Error(error.message)
      }
      return new Error()
    }
  }
}
