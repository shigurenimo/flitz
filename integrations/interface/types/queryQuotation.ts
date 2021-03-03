import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"
import { QueryPost } from "integrations/interface/types/queryPost"

export type QueryQuotation = QueryPost & {
  user: QueryEmbeddedUser
}
