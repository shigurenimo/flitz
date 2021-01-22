import { IUserEntity } from "domain/entities/interfaces"
import { Email, HashedPassword, Id, UserRole } from "domain/valueObjects"

export interface IAccountEntity {
  createdAt: Date
  email: Email
  hashedPassword: HashedPassword | null
  id: Id
  role: UserRole
  user: IUserEntity | null
  userId: Id
}
