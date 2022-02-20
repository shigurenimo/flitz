import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import {
  CountMessagesQuery,
  FindGroupMessagesQuery,
} from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({
  exchangeId: z.string(),
  skip: z.number(),
})

const getGroupMessages = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props) => {
    return {
      exchangeId: new Id(props.exchangeId),
      skip: props.skip,
      take: 16,
    }
  },
  async (props) => {
    const findGroupMessagesQuery = container.resolve(FindGroupMessagesQuery)

    const messages = await findGroupMessagesQuery.execute({
      skip: props.skip,
      exchangeId: props.exchangeId,
    })

    if (messages instanceof Error) {
      throw messages
    }

    const countMessagesQuery = container.resolve(CountMessagesQuery)

    const count = await countMessagesQuery.execute({
      exchangeId: props.exchangeId,
    })

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
        return messages
      },
    })
  }
)

export default withSentry(getGroupMessages, "getGroupMessages")
