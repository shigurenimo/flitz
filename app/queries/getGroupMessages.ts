import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { CountMessagesQuery, FindGroupMessagesQuery } from "service"

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
    const query = container.resolve(FindGroupMessagesQuery)

    const messages = await query.execute({
      skip: props.skip,
      messageThreadId: props.messageThreadId,
    })

    if (messages instanceof Error) {
      throw messages
    }

    const countQuery = container.resolve(CountMessagesQuery)

    const count = await countQuery.execute({
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
