import db from "db"
import { IAccountRepository } from "domain/repositories"
import { Email, HashedPassword, Id } from "domain/valueObjects"
import { PrismaAdapter } from "infrastructure/adapters"

export class AccountRepository implements IAccountRepository {
  prismaAdapter: PrismaAdapter

  constructor() {
    this.prismaAdapter = new PrismaAdapter()
  }

  async findByUserId(userId: Id) {
    const account = await db.account.findUnique({
      where: { userId: userId.value },
      include: { user: true },
    })

    const accountEntity = this.prismaAdapter.toAccountEntity(account)

    return { account, accountEntity }
  }

  /**
   * メールアドレスで指定しアカウントを取得する
   * @param email
   * @returns
   */
  async getAccountByEmail(email: Email) {
    const account = await db.account.findUnique({
      where: { email: email.value },
      include: {
        user: {
          include: { iconImage: true },
        },
      },
    })

    const accountEntity = new PrismaAdapter().toAccountEntity(account)

    return { account, accountEntity }
  }

  async updateByUserId(userId: Id, input: { email: Email }) {
    await db.account.update({
      where: { userId: userId.value },
      data: {
        email: input.email.value,
      },
    })

    return null
  }

  async updateHashedPassword(input: {
    id: Id
    hashedPassword: HashedPassword
  }) {
    await db.account.update({
      where: { id: input.id.value },
      data: { hashedPassword: input.hashedPassword.value },
    })

    return null
  }
}
