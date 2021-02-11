import { AuthenticationError, Ctx, NotFoundError, resolver } from "blitz"
import {
  Email,
  emailSchema,
  Password,
  passwordSchema,
  PasswordService,
} from "integrations/domain"
import {
  AccountRepository,
  SessionRepository,
} from "integrations/infrastructure"
import * as z from "zod"

const Login = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export default resolver.pipe(
  resolver.zod(Login),
  (input) => ({
    email: new Email(input.email),
    password: new Password(input.password),
  }),
  async ({ email, password }, ctx: Ctx) => {
    const accountRepository = new AccountRepository()

    const {
      account,
      accountEntity,
    } = await accountRepository.getAccountByEmail(email)

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
)
