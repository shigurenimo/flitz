import { AuthenticationError, Ctx, NotFoundError } from "blitz"
import { PasswordService } from "domain/services"
import {
  HashedPassword,
  Id,
  Password,
  passwordSchema,
} from "domain/valueObjects"
import { AccountRepository, SessionRepository } from "infrastructure"
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

  const userId = SessionRepository.getUserId(ctx.session)

  const account = await AccountRepository.findByUserId(userId)

  if (!account || account.hashedPassword === null) {
    throw new NotFoundError()
  }

  // 現在のパスワードを確認する
  const result = await PasswordService.verifyPassword(
    new HashedPassword(account.hashedPassword),
    currentPassword
  )

  if (PasswordService.isInvalid(result)) {
    throw new AuthenticationError()
  }

  const hashedPassword = await PasswordService.hashPassword(password)

  // 新しいパスワードを保存する
  await AccountRepository.updateHashedPassword({
    id: new Id(account.id),
    hashedPassword,
  })

  return null
}

export default updateAccountPassword
