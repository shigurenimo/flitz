import type { UserEntity } from "integrations/domain/entities"
import type {
  Email,
  HashedPassword,
  Id,
  UserRole,
} from "integrations/domain/valueObjects"

export class AccountEntity {
  createdAt!: Date
  email!: Email
  hashedPassword!: HashedPassword | null
  id!: Id
  role!: UserRole
  user!: UserEntity | null
  userId!: Id

  constructor(public props: Omit<AccountEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
