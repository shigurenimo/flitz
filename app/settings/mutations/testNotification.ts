import { Ctx } from "blitz"
import { SessionRepository } from "infrastructure"
import { MessagingService } from "services"

const testNotification = async (_: void, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = SessionRepository.getUserId(ctx.session)

  return MessagingService.sendTestMesasge({ userId })
}

export default testNotification
