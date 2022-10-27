import { UserRole } from "core/valueObjects"

export class UserRoleFactory {
  static user() {
    return new UserRole("USER")
  }
}
