import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountMessagesQuery, FindGroupMessagesQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zProps = z.object({
  messageThreadId: z.string(),
  skip: z.number(),
})

const getGroupMessages = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props) => {
    return {
      messageThreadId: new Id(props.messageThreadId),
      skip: props.skip,
      take: 16,
    }
  },
  async (props) => {
    const findGroupMessagesQuery = container.resolve(FindGroupMessagesQuery)

    const messages = await findGroupMessagesQuery.execute({
      skip: props.skip,
      messageThreadId: props.messageThreadId,
    })

    if (messages instanceof Error) {
      throw messages
    }

    const countMessagesQuery = container.resolve(CountMessagesQuery)

    const count = await countMessagesQuery.execute({
      messageThreadId: props.messageThreadId,
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
