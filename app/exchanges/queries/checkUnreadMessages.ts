import { resolver } from "blitz"
import { UserExchangeQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"

const checkUnreadMessages = resolver.pipe(
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const userExchangeQuery = container.resolve(UserExchangeQuery)

    const existence = await userExchangeQuery.checkExistence({
      userId: props.userId,
    })

    return existence
  }
)

export default checkUnreadMessages
