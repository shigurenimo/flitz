import type { Id } from "core/valueObjects"
import { AppMessage } from "integrations/types/appMessage"

/**
 * メッセージ
 */
export class MessageService {
  hasUnreadMessages(input: { messages: AppMessage[]; userId: Id }) {
    const unreadMessages = input.messages.filter((message) => {
      if (message.user.id === input.userId.value) return false
      return !message.isRead
    })

    return 0 < unreadMessages.length
  }
}
