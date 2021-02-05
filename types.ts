import { simpleRolesIsAuthorized } from "@blitzjs/server"
import { DefaultCtx, SessionContext } from "blitz"
import { Account, File, User } from "db"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }

  export interface Session {
    isAuthorized: typeof simpleRolesIsAuthorized
    PublicData: {
      iconImageId: File["id"] | null
      name: User["name"]
      userId: User["id"]
      username: User["username"]
      roles: Account["role"][]
    }
  }
}
