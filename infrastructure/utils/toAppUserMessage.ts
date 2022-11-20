import { AppMessage } from "infrastructure/models"
import { PrismaMessage } from "infrastructure/types"
import { toAppUserEmbedded } from "infrastructure/utils/toAppUserEmbedded"

export const toAppUserMessage = (prismaMessage: PrismaMessage): AppMessage => {
  return {
    id: prismaMessage.id,
    createdAt: prismaMessage.createdAt,
    isRead: prismaMessage.isRead,
    text: prismaMessage.text,
    updatedAt: prismaMessage.updatedAt,
    user: toAppUserEmbedded(prismaMessage.user),
  }
}
