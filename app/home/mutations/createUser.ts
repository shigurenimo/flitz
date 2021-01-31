import { Ctx } from "blitz"
import { HashedPasswordFactory, NameFactory } from "domain/factories"
import { Biography, Email, Password, UserRole } from "domain/valueObjects"
import { SessionRepository, UserRepository } from "infrastructure/repositories"
import * as z from "zod"

export const inputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(100),
})

const createUser = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  const { email, password } = inputSchema
    .transform((input) => ({
      email: new Email(input.email),
      password: new Password(input.password),
    }))
    .parse(input)

  const hashedPassword = await HashedPasswordFactory.fromPassword(password)

  const role = new UserRole("USER")

  const name = NameFactory.fromEmail(email)

  const userRepository = new UserRepository()

  const { user, userEntity } = await userRepository.createUser({
    biography: new Biography(""),
    email,
    hashedPassword,
    name,
    role,
  })

  const sessionRepository = new SessionRepository()

  await sessionRepository.createSession(ctx.session, {
    name: userEntity.name,
    role,
    userId: userEntity.id,
    username: userEntity.username,
    iconImageId: null,
  })

  return user
}

export default createUser
