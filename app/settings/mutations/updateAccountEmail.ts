import { Ctx } from "blitz"
import { Email, emailSchema } from "domain/valueObjects"
import { AccountRepository, SessionRepository } from "infrastructure"
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

  const userId = SessionRepository.getUserId(ctx.session)

  // メールアドレスを更新する
  await AccountRepository.updateByUserId(userId, { email })

  return null
}

export default updateAccountEmail
