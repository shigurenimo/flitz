import { Ctx } from "blitz"
import { SessionRepository } from "infrastructure/repositories"
import { MessagingService } from "services"

const testNotification = async (_: void, ctx: Ctx) => {
  ctx.session.authorize()

  const sessionRepository = new SessionRepository()

  const userId = sessionRepository.getUserId(ctx.session)

  const messagingService = new MessagingService()

  return messagingService.sendTestMesasge({ userId })
}

export default testNotification
