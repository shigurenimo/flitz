import { Ctx } from "blitz"

const logout = async (_: any, { session }: Ctx) => {
  await session.revoke()
}

export default logout
