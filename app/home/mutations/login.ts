import { AuthenticationError, Ctx, NotFoundError } from "blitz"
import { PasswordService } from "domain/services"
import {
  Email,
  emailSchema,
  HashedPassword,
  Id,
  Name,
  Password,
  passwordSchema,
  Username,
  UserRole,
} from "domain/valueObjects"
import { AccountRepository, SessionRepository } from "integrations"
import * as z from "zod"

const inputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

const login = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  const email = new Email(input.email)

  const password = new Password(input.password)

  const account = await AccountRepository.getAccountByEmail(email)

  if (!account || account.hashedPassword === null) {
    throw new NotFoundError()
  }

  const result = await PasswordService.verifyPassword(
    new HashedPassword(account.hashedPassword),
    password
  )

  if (PasswordService.isInvalid(result)) {
    throw new AuthenticationError()
  }

  if (PasswordService.needsRehash(result)) {
    const newHashedPassword = await PasswordService.hashPassword(password)

    await AccountRepository.updateAccount({
      id: new Id(account.id),
      hashedPassword: newHashedPassword,
    })
  }

  await SessionRepository.createSession(ctx.session, {
    name: Name.nullable(account.user.name),
    role: new UserRole(account.role),
    userId: new Id(account.user.id),
    username: new Username(account.user.username),
  })

  return account.user
}

export default login
