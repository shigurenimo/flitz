import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"
import { QueryPost } from "integrations/interface/types/queryPost"
import { QueryQuotation } from "integrations/interface/types/queryQuotation"

export type QueryFeed = QueryPost & {
  isRead: boolean
  user: QueryEmbeddedUser
  quotation: QueryQuotation | null
  reply: QueryQuotation | null
}
