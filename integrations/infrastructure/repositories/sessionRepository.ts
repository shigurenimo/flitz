import { SessionContext } from "blitz"
import { ISessionRepository } from "integrations/domain/repositories"
import { Id, Name, Username, UserRole } from "integrations/domain/valueObjects"

export class SessionRepository implements ISessionRepository {
  async createSession(
    sessionContext: SessionContext,
    input: {
      name: Name | null
      role: UserRole
      userId: Id
      username: Username
      iconImageId: Id | null
    }
  ) {
    await sessionContext.$create({
      iconImageId: input.iconImageId?.value || null,
      name: input.name?.value || null,
      roles: [input.role.value],
      userId: input.userId.value,
      username: input.username.value,
    })

    return null
  }

  async revokeSession(sessionContext: SessionContext) {
    await sessionContext.$revoke()

    return null
  }

  async updatePublicData(
    sessionContext: SessionContext,
    input: {
      name: Name | null
      username: Username
      iconImageId: Id | null
    }
  ) {
    await sessionContext.$setPublicData({
      iconImageId: input.iconImageId?.value || null,
      name: input.name?.value || null,
      username: input.username.value,
    })

    return null
  }

  getUserId(session: { userId: string }) {
    return new Id(session.userId)
  }
}
