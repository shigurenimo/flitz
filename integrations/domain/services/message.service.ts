import type { Id } from "integrations/domain/valueObjects"
import { QueryUserMessage } from "integrations/interface/types/queryUserMessage"

/**
 * メッセージ
 */
export class MessageService {
  hasUnreadMessages(input: { messages: QueryUserMessage[]; userId: Id }) {
    const unreadMessages = input.messages.filter((message) => {
      if (message.user.id === input.userId.value) return false
      return !message.isRead
    })

    return unreadMessages.length > 0
  }
}
