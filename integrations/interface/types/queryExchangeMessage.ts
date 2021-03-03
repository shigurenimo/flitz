import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"
import { QueryLastMessage } from "integrations/interface/types/queryLastMessage"

export type QueryUserExchange = {
  id: string
  createdAt: Date
  isRead: boolean
  lastMessage: QueryLastMessage
  relatedUser: QueryEmbeddedUser
}
