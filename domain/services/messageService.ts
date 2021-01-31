import type { MessageEntity } from "domain/entities"
import type { Id } from "domain/valueObjects"

/**
 * ## メッセージ
 */
export class MessageService {
  hasUnreadMessages(input: { messageEntities: MessageEntity[]; userId: Id }) {
    const unreadMessages = input.messageEntities.filter((message) => {
      if (message.userId.value === input.userId.value) return false
      for (const exchange of message.exchanges) {
        if (exchange.relatedUserId === null) continue
        if (exchange.userId.value === input.userId.value) continue
        return !message.isRead
      }
      return false
    })

    return unreadMessages.length > 0
  }
}
