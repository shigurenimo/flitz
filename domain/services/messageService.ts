import { Exchange, Message } from "db"
import { Id } from "domain/valueObjects"

/**
 * ## メッセージ
 */
export class MessageService {
  static hasUnreadMessages(input: {
    messages: (Message & { exchanges: Exchange[] })[]
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

    console.log("unreadMessages", unreadMessages)

    return unreadMessages.length > 0
  }
}
