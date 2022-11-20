import { AppNotification } from "infrastructure/models"
import { PrismaNotification } from "infrastructure/types"
import { toAppPost } from "infrastructure/utils/toAppPost"
import { toAppUserEmbedded } from "infrastructure/utils/toAppUserEmbedded"

export const toAppNotification = (
  prismaNotification: PrismaNotification
): AppNotification | null => {
  // フォローの通知
  if (prismaNotification.friendship !== null) {
    return {
      id: prismaNotification.id,
      createdAt: prismaNotification.createdAt,
      type: "FOLLOW",
      isRead: prismaNotification.isRead,
      embedded: toAppUserEmbedded(prismaNotification.friendship.follower),
    }
  }

  // ライクの通知
  if (prismaNotification.like !== null) {
    return {
      id: prismaNotification.id,
      createdAt: prismaNotification.createdAt,
      type: "LIKE",
      isRead: prismaNotification.isRead,
      embedded: {
        id: prismaNotification.like.post.id,
        createdAt: prismaNotification.like.post.createdAt,
        text: prismaNotification.like.post.text || null,
        user: toAppUserEmbedded(prismaNotification.like.user),
      },
    }
  }

  // リプライの通知
  if (prismaNotification.post !== null) {
    return {
      id: prismaNotification.id,
      createdAt: prismaNotification.createdAt,
      type: "POST",
      isRead: prismaNotification.isRead,
      embedded: toAppPost(prismaNotification.post),
    }
  }

  return null
}
