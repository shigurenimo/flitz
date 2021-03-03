import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"

export type QueryUserMessage = {
  id: string
  createdAt: Date
  isRead: boolean
  text: string
  updatedAt: Date
  user: QueryEmbeddedUser
}
