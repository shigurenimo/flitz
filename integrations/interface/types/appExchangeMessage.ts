import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"
import { AppLastMessage } from "integrations/interface/types/appLastMessage"

export type AppUserExchange = {
  id: string
  createdAt: Date
  isRead: boolean
  lastMessage: AppLastMessage
  relatedUser: AppEmbeddedUser
}
