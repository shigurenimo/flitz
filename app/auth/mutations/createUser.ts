import { hashPassword } from "app/auth/utils/hashPassword"
import { CreateUserInput, createUserSchema } from "app/auth/validations/createUserSchema"
import { Ctx } from "blitz"
import db from "db"

const createUser = async (input: CreateUserInput, { session }: Ctx) => {
  // This throws an error if input is invalid
  const { email, password } = createUserSchema.parse(input)

  const hashedPassword = await hashPassword(password)

  const user = await db.user.create({
    data: {
      account: {
        create: {
          email: email.toLowerCase(),
          hashedPassword,
          role: "USER",
        },
      },
      name: email.substring(0, email.lastIndexOf("@")),
    },
    include: { account: true },
  })

  if (user.account === null) {
    throw new Error("Sorry, we had an unexpected error. Please try again.")
  }

  await session.create({
    name: user.name,
    roles: [user.account.role],
    userId: user.id,
    username: user.username,
  })

  const { account, ...rest } = user

  return rest
}

export default createUser
