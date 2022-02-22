import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import {
  CountMessageThreadsQuery,
  FindMessageThreadsQuery,
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
    const findMessageThreadsQuery = container.resolve(FindMessageThreadsQuery)

    const messageThreads = await findMessageThreadsQuery.execute({
      userId: props.userId,
      skip: props.skip,
    })

    if (messageThreads instanceof Error) {
      throw messageThreads
    }

    const countExchangesQuery = container.resolve(CountMessageThreadsQuery)

    const count = await countExchangesQuery.execute({ userId: props.userId })

    if (count instanceof Error) {
      throw count
    }

    return paginate({
      skip: props.skip,
      take: props.take,
      async count() {
        return count
      },
      async query() {
        return messageThreads
      },
    })
  }
)

export default withSentry(getExchanges, "getExchanges")
