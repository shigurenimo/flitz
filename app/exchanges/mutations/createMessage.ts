import { resolver } from "blitz"
import { container } from "tsyringe"
import { withSentry } from "app/core/utils/withSentry"
import { zCreateMessageMutation } from "app/exchanges/validations/createMessageMutation"
import { SendMessageService } from "integrations/application"
import { Id, PostText } from "integrations/domain"

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
    const sendMessageService = container.resolve(SendMessageService)

    const transaction = await sendMessageService.execute({
      text: props.text,
      userId: props.userId,
      relatedUserId: props.relatedUserId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(createMessage, "createMessage")
