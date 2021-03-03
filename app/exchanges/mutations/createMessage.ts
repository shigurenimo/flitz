import { zCreateMessageMutation } from "app/exchanges/validations/createMessageMutation"
import { resolver } from "blitz"
import { SendMessageService } from "integrations/application"
import { Id, PostText } from "integrations/domain"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(
  resolver.zod(zCreateMessageMutation),
  resolver.authorize(),
  (input, ctx) => ({
    relatedUserId: new Id(input.relatedUserId),
    text: new PostText(input.text),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(SendMessageService).call({
      text: input.text,
      userId: input.userId,
      relatedUserId: input.relatedUserId,
    })

    return null
  }
)
