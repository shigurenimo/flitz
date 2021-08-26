import type { Id } from "integrations/domain/valueObjects"
import { AppUserMessage } from "integrations/interface/types/appUserMessage"

/**
 * メッセージ
 */
export class MessageService {
  hasUnreadMessages(input: { messages: AppUserMessage[]; userId: Id }) {
    const unreadMessages = input.messages.filter((message) => {
      if (message.user.id === input.userId.value) return false
      return !message.isRead
    })

    return unreadMessages.length > 0
  }
}
