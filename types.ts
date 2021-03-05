import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { File, User, UserRole } from "db"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }

  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<UserRole>
    PublicData: {
      iconImageId: File["id"] | null
      name: User["name"]
      userId: User["id"]
      username: User["username"]
      role: User["role"]
    }
  }
}
