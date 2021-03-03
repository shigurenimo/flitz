import { MessageBlock } from "app/exchanges/types/messageBlock"
import { QueryUserMessage } from "integrations/interface/types/queryUserMessage"

type MessageWithUser = QueryUserMessage

export const useMessageBlocks = (
  messages: MessageWithUser[],
  recipientId: string
) => {
  let userId: null | string = null

  const blocks: MessageBlock[] = []

  const sortedMesasges = messages.sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime()
  })

  sortedMesasges.forEach((message, index) => {
    const isLastIndex = sortedMesasges.length < index + 2

    const nextMesasge = isLastIndex ? null : sortedMesasges[index + 1]

    const isLastMessage =
      nextMesasge !== null && nextMesasge.user.id !== message.user.id

    blocks.push({
      ...message,
      align: recipientId === message.user.id ? "left" : "right",
      hasAvatar: userId !== message.user.id,
      hasTime: isLastIndex || isLastMessage,
      userId: message.user.id,
      userName: message.user.name || message.user.username,
    })

    userId = message.user.id
  })

  return blocks
}
