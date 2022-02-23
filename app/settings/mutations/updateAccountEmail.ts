import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { UpdateAccountEmailService } from "integrations/application"
import { Email, Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zUpdateAccountEmailMutation = z.object({ email: z.string() })

const updateAccountEmail = resolver.pipe(
  resolver.zod(zUpdateAccountEmailMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      email: new Email(props.email),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const updateAccountEmailService = container.resolve(
      UpdateAccountEmailService
    )

    const transaction = await updateAccountEmailService.execute({
      email: props.email,
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(updateAccountEmail, "updateAccountEmail")
