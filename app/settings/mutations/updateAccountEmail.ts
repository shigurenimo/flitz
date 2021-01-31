import { Ctx } from "blitz"
import { Email, emailSchema } from "domain/valueObjects"
import {
  AccountRepository,
  SessionRepository,
} from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({ email: emailSchema })

const updateAccountEmail = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  ctx.session.authorize()

  const { email } = inputSchema
    .transform((input) => ({ email: new Email(input.email) }))
    .parse(input)

  const sessionRepository = new SessionRepository()

  const userId = sessionRepository.getUserId(ctx.session)

  const accountRepository = new AccountRepository()

  // メールアドレスを更新する
  await accountRepository.updateByUserId(userId, { email })

  return null
}

export default updateAccountEmail
