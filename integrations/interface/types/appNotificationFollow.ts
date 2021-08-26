import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"

export type AppNotificationFollow = {
  id: string
  createdAt: Date
  type: "FOLLOW"
  isRead: boolean
  embedded: AppEmbeddedUser
}
