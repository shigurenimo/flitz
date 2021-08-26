import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"

export type AppUserMessage = {
  id: string
  createdAt: Date
  isRead: boolean
  text: string
  updatedAt: Date
  user: AppEmbeddedUser
}
