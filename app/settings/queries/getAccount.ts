import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { FindUserSimpleQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.null()

const getAccount = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const findUserQuery = container.resolve(FindUserSimpleQuery)

    const user = await findUserQuery.execute(props.userId)

    if (user instanceof Error) {
      throw user
    }

    return user
  }
)

export default withSentry(getAccount, "getAccount")
