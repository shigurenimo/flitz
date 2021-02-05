import { resolver } from "blitz"
import { Email, emailSchema, Id } from "domain/valueObjects"
import { AccountRepository } from "infrastructure/repositories"
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
