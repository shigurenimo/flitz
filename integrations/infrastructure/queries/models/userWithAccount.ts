import { Account, User } from "db"
import { HashedPassword, Id } from "integrations/domain"
import { Entity } from "integrations/infrastructure"

export class UserWithAccount<
  T extends Account & { user: User }
> extends Entity<T> {
  get id() {
    return new Id(this._.id)
  }

  get hashedPassword() {
    return this._.hashedPassword
      ? new HashedPassword(this._.hashedPassword)
      : null
  }
}
