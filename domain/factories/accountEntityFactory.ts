import { Account } from "db"
import { AccountEntity, UserEntity } from "domain/entities"
import { Email, HashedPassword, Id, UserRole } from "domain/valueObjects"

type AccountRelation = {
  user?: UserEntity
}

export class AccountEntityFactory {
  static fromAccount(data: Account & AccountRelation) {
    return new AccountEntity({
      createdAt: data.createdAt,
      email: new Email(data.email),
      hashedPassword: data.hashedPassword
        ? new HashedPassword(data.hashedPassword)
        : null,
      id: new Id(data.id),
      role: new UserRole(data.role),
      user: data.user || null,
      userId: new Id(data.userId),
    })
  }
}
