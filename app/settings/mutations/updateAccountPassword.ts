import { AuthenticationError, Ctx, NotFoundError } from "blitz"
import { PasswordService } from "domain/services"
import { Password, passwordSchema } from "domain/valueObjects"
import {
  AccountRepository,
  SessionRepository,
} from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  currentPassword: passwordSchema,
  password: passwordSchema,
})

const updateAccountPassword = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  ctx.session.authorize()

  const { currentPassword, password } = inputSchema
    .transform((input) => ({
      currentPassword: new Password(input.password),
      password: new Password(input.password),
    }))
    .parse(input)

  const sessionRepository = new SessionRepository()

  const userId = sessionRepository.getUserId(ctx.session)

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

export default updateAccountPassword
