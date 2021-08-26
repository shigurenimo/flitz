import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"

export type AppLike = {
  id: string
  createdAt: Date
  isRead: boolean
  text: string
  updatedAt: Date
  user: AppEmbeddedUser
}
