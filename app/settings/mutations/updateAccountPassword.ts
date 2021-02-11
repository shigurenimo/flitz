import { AuthenticationError, NotFoundError, resolver } from "blitz"
import { PasswordService } from "integrations/domain/services"
import { Id, Password, passwordSchema } from "integrations/domain/valueObjects"
import { AccountRepository } from "integrations/infrastructure/repositories"
import * as z from "zod"

const UpdateAccountPassword = z.object({
  currentPassword: passwordSchema,
  password: passwordSchema,
})

export default resolver.pipe(
  resolver.zod(UpdateAccountPassword),
  resolver.authorize(),
  (input, ctx) => ({
    currentPassword: new Password(input.currentPassword),
    password: new Password(input.password),
    userId: new Id(ctx.session.userId),
  }),
  async ({ currentPassword, password, userId }) => {
    const accountRepository = new AccountRepository()

    const { accountEntity } = await accountRepository.findByUserId(userId)

    if (!accountEntity || accountEntity.hashedPassword === null) {
      throw new NotFoundError()
    }

    const passwordService = new PasswordService()

    // 現在のパスワードを確認する
    const result = await passwordService.verifyPassword(
      accountEntity.hashedPassword,
      currentPassword
    )

    if (passwordService.isInvalid(result)) {
      throw new AuthenticationError()
    }

    const hashedPassword = await passwordService.hashPassword(password)

    // 新しいパスワードを保存する
    await accountRepository.updateHashedPassword({
      id: accountEntity.id,
      hashedPassword,
    })

    return null
  }
)
