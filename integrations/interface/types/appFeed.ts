import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"
import { AppPost } from "integrations/interface/types/appPost"
import { AppQuotation } from "integrations/interface/types/appQuotation"

export type AppFeed = AppPost & {
  isRead: boolean
  user: AppEmbeddedUser
  quotation: AppQuotation | null
  reply: AppQuotation | null
}
