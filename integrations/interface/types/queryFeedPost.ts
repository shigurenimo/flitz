import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"
import { QueryPost } from "integrations/interface/types/queryPost"
import { QueryQuotation } from "integrations/interface/types/queryQuotation"

export type QueryFeedPost = QueryPost & {
  quotation: QueryQuotation | null
  reply: QueryQuotation | null
  user: QueryEmbeddedUser
}
