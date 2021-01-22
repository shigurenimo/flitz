import { IAccountEntity, IUserEntity } from "domain/entities/interfaces"
import { Email, HashedPassword, Id, UserRole } from "domain/valueObjects"

export class AccountEntity implements IAccountEntity {
  createdAt!: Date
  email!: Email
  hashedPassword!: HashedPassword | null
  id!: Id
  role!: UserRole
  user!: IUserEntity | null
  userId!: Id

  constructor(public props: IAccountEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
