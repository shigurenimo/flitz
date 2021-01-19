import { Ctx } from "blitz"
import {
  Biography,
  Email,
  HashedPassword,
  Id,
  Name,
  Password,
  Username,
  UserRole,
} from "domain/valueObjects"
import { SessionRepository, UserRepository } from "integrations"
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

  const hashedPassword = await HashedPassword.fromPassword(password)

  const role = new UserRole("USER")

  const name = Name.fromEmail(input.email)

  const user = await UserRepository.createUser({
    biography: new Biography(""),
    email,
    hashedPassword,
    name,
    role,
  })

  await SessionRepository.createSession(ctx.session, {
    name: Name.nullable(user.name),
    role,
    userId: new Id(user.id),
    username: new Username(user.username),
  })

  return user
}

export default createUser
