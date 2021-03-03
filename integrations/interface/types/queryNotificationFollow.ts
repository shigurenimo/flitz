import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"

export type QueryNotificationFollow = {
  id: string
  createdAt: Date
  type: "FOLLOW"
  isRead: boolean
  embedded: QueryEmbeddedUser
}
