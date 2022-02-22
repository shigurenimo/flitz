import type { Id } from "integrations/domain/valueObjects"
import { AppMessage } from "integrations/interface/types/appMessage"

/**
 * メッセージ
 */
export class MessageService {
  hasUnreadMessages(input: { messages: AppMessage[]; userId: Id }) {
    const unreadMessages = input.messages.filter((message) => {
      if (message.user.id === input.userId.value) return false
      return !message.isRead
    })

    return unreadMessages.length > 0
  }
}
