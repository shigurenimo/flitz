import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"
import { AppPost } from "integrations/interface/types/appPost"

export type AppQuotation = AppPost & {
  user: AppEmbeddedUser
}
