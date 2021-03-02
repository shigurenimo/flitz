import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"

export type QueryLike = {
  id: string
  createdAt: Date
  isRead: boolean
  text: string
  updatedAt: Date
  user: QueryEmbeddedUser
}
