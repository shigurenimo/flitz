import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import {
  CountExchangesQuery,
  FindExchangesQuery,
} from "integrations/application"
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
    const findExchangesQuery = container.resolve(FindExchangesQuery)

    const exchanges = await findExchangesQuery.execute({
      userId: props.userId,
      skip: props.skip,
    })

    const countExchangesQuery = container.resolve(CountExchangesQuery)

    const count = await countExchangesQuery.execute({ userId: props.userId })

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

export default withSentry(getExchanges, "getExchanges")
