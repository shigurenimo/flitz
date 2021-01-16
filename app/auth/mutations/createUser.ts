import { SessionRepository, UserRepository } from "app/domain/repositories"
import {
  Biography,
  Email,
  HashedPassword,
  Id,
  Name,
  Password,
  Username,
  UserRole,
} from "app/domain/valueObjects"
import { Ctx } from "blitz"
import * as z from "zod"

export const inputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(100),
})

const transformer = z.transformer(
  inputSchema,
  z.object({
    email: z.instanceof(Email),
    password: z.instanceof(Password),
  }),
  (input) => {
    return {
      email: new Email(input.email),
      password: new Password(input.password),
    }
  }
)

const createUser = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  const { email, password } = transformer.parse(input)

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
