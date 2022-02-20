import { UserRole } from "integrations/domain/valueObjects"

export class UserRoleFactory {
  static user() {
    return new UserRole("USER")
  }
}
