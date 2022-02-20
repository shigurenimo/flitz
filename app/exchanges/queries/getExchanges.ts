import { paginate, resolver } from "blitz"
import { UserExchangeQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({ skip: z.number() })

const getExchanges = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 16,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const userExchangeQuery = container.resolve(UserExchangeQuery)

    const exchanges = await userExchangeQuery.findMany({
      userId: props.userId,
      skip: props.skip,
    })

    const count = await userExchangeQuery.count({ userId: props.userId })

    return paginate({
      skip: props.skip,
      take: props.take,
      async count() {
        return count
      },
      async query() {
        return exchanges
      },
    })
  }
)

export default getExchanges
