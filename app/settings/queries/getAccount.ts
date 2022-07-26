import { resolver } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import { FindUserSimpleQuery } from "integrations/application"
import { Id } from "integrations/domain"

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
    const findUserSimpleQuery = container.resolve(FindUserSimpleQuery)

    const user = await findUserSimpleQuery.execute(props.userId)

    if (user instanceof Error) {
      throw user
    }

    return user
  }
)

export default withSentry(getAccount, "getAccount")
