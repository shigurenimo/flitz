import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"
import { AppPost } from "integrations/interface/types/appPost"
import { AppQuotation } from "integrations/interface/types/appQuotation"

export type AppFeedPost = AppPost & {
  quotation: AppQuotation | null
  reply: AppQuotation | null
  user: AppEmbeddedUser
}
