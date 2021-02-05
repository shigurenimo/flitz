import { resolver } from "blitz"
import { HashedPasswordFactory, NameFactory } from "domain/factories"
import { Biography, Email, Password, UserRole } from "domain/valueObjects"
import { SessionRepository, UserRepository } from "infrastructure/repositories"
import * as z from "zod"

export const CreateUser = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(100),
})

export default resolver.pipe(
  resolver.zod(CreateUser),
  (input) => ({
    email: new Email(input.email),
    password: new Password(input.password),
  }),
  async ({ email, password }, ctx) => {
    const hashedPassword = await HashedPasswordFactory.fromPassword(password)

    const userRepository = new UserRepository()

    const { user, userEntity } = await userRepository.createUser({
      biography: new Biography(""),
      email,
      hashedPassword,
      name: NameFactory.fromEmail(email),
      role: new UserRole("USER"),
    })

    const sessionRepository = new SessionRepository()

    await sessionRepository.createSession(ctx.session, {
      name: userEntity.name,
      role: new UserRole("USER"),
      userId: userEntity.id,
      username: userEntity.username,
      iconImageId: null,
    })

    return user
  }
)
