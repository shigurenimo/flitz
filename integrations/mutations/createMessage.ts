import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { SendMessageService } from "application"
import { Id, PostText } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zCreateMessageMutation } from "interface/exchanges/validations/createMessageMutation"

const createMessage = resolver.pipe(
  resolver.zod(zCreateMessageMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      relatedUserId: new Id(props.relatedUserId),
      text: new PostText(props.text),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const service = container.resolve(SendMessageService)

    const result = await service.execute({
      text: props.text,
      userId: props.userId,
      relatedUserId: props.relatedUserId,
    })

    if (result instanceof Error) {
      throw result
    }

    return null
  }
)

export default withSentry(createMessage, "createMessage")
