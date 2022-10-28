import { SessionContext, SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { File, User, UserRole } from "db"

declare module "@blitzjs/auth" {
  export interface Ctx {
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
