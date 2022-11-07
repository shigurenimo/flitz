import { PrismaMessage } from "infrastructure/types"
import { toAppUserEmbedded } from "infrastructure/utils/toAppUserEmbedded"
import { AppMessage } from "integrations/types"

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
