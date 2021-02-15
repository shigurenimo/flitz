import { Exchange, Message, User } from "db"
import type { Id } from "integrations/domain/valueObjects"

/**
 * メッセージ
 */
export class MessageService {
  hasUnreadMessages(input: {
    messages: (Message & {
      user: User
      exchanges: Exchange[]
    })[]
    userId: Id
  }) {
    const unreadMessages = input.messages.filter((message) => {
      if (message.userId === input.userId.value) return false
      for (const exchange of message.exchanges) {
        if (exchange.relatedUserId === null) continue
        if (exchange.userId === input.userId.value) continue
        return !message.isRead
      }
      return false
    })

    return unreadMessages.length > 0
  }
}
