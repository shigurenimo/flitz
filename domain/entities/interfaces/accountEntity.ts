import type { UserEntity } from "domain/entities"
import type { Email, HashedPassword, Id, UserRole } from "domain/valueObjects"

export interface IAccountEntity {
  createdAt: Date
  email: Email
  hashedPassword: HashedPassword | null
  id: Id
  role: UserRole
  user: UserEntity | null
  userId: Id
}
