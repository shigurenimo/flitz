import { authenticateUser } from "app/auth/utils/authenticateUser"
import { LoginInput, loginSchema } from "app/auth/validations/loginSchema"
import { Ctx } from "blitz"

const login = async (input: LoginInput, { session }: Ctx) => {
  // This throws an error if input is invalid
  const { email, password } = loginSchema.parse(input)

  const user = await authenticateUser(email, password)

  await session.create({
    name: user.name,
    roles: [user.role],
    userId: user.id,
    username: user.username,
  })

  return user
}

export default login
