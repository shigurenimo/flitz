import { withSentry } from "app/core/utils/withSentry"
import { zCreateMessageMutation } from "app/exchanges/validations/createMessageMutation"
import { resolver } from "blitz"
import { SendMessageService } from "integrations/application"
import { Id, PostText } from "integrations/domain"
import { container } from "tsyringe"

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

    await sendMessageService.execute({
      text: props.text,
      userId: props.userId,
      relatedUserId: props.relatedUserId,
    })

    return null
  }
)

export default withSentry(createMessage, "createMessage")
