import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountMessageThreadsQuery, FindMessageThreadsQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

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
