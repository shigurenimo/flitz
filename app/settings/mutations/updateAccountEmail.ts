import { resolver } from "blitz"
import { Email, emailSchema, Id } from "integrations/domain"
import { AccountRepository } from "integrations/infrastructure"
import * as z from "zod"

const UpdateAccountEmail = z.object({ email: emailSchema })

export default resolver.pipe(
  resolver.zod(UpdateAccountEmail),
  resolver.authorize(),
  (input, ctx) => ({
    email: new Email(input.email),
    userId: new Id(ctx.session.userId),
  }),
  async ({ email, userId }) => {
    const accountRepository = new AccountRepository()

    // メールアドレスを更新する
    await accountRepository.updateByUserId(userId, { email })

    return null
  }
)
