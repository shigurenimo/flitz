import { DefaultCtx, DefaultPublicData, SessionContext } from "blitz"
import { File, User } from "db"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface PublicData extends DefaultPublicData {
    iconImageId: File["id"] | null
    name: User["name"]
    userId: User["id"]
    username: User["username"]
  }
}
