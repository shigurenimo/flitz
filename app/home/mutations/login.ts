import { AuthenticationError, Ctx, NotFoundError } from "blitz"
import { PasswordService } from "domain/services"
import {
  Email,
  emailSchema,
  Password,
  passwordSchema,
} from "domain/valueObjects"
import {
  AccountRepository,
  SessionRepository,
} from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

const login = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  const email = new Email(input.email)

  const password = new Password(input.password)

  const accountRepository = new AccountRepository()

  const { account, accountEntity } = await accountRepository.getAccountByEmail(
    email
  )

  if (
    account === null ||
    accountEntity === null ||
    accountEntity.user === null ||
    accountEntity.hashedPassword === null
  ) {
    throw new NotFoundError()
  }

  const passwordService = new PasswordService()

  const result = await passwordService.verifyPassword(
    accountEntity.hashedPassword,
    password
  )

  if (passwordService.isInvalid(result)) {
    throw new AuthenticationError()
  }

  if (passwordService.needsRehash(result)) {
    const newHashedPassword = await passwordService.hashPassword(password)

    await accountRepository.updateHashedPassword({
      id: accountEntity.id,
      hashedPassword: newHashedPassword,
    })
  }

  const sessionRepository = new SessionRepository()

  await sessionRepository.createSession(ctx.session, {
    name: accountEntity.user?.name || null,
    role: accountEntity.role,
    userId: accountEntity.user.id,
    username: accountEntity.user.username,
    iconImageId: accountEntity.user.iconImage?.id || null,
  })

  return account.user
}

export default login
