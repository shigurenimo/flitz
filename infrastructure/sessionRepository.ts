import { SessionContext } from "blitz"
import { Id, Name, Username, UserRole } from "domain/valueObjects"

/**
 * ## セッション
 */
export class SessionRepository {
  /**
   * 新しいセッションを作成する
   * @param session
   * @param input
   * @returns
   */
  static createSession(
    session: SessionContext,
    input: {
      name: Name | null
      role: UserRole
      userId: Id
      username: Username
      iconImageId: Id | null
    }
  ) {
    return session.create({
      iconImageId: input.iconImageId?.value || null,
      name: input.name?.value || null,
      roles: [input.role.value],
      userId: input.userId.value,
      username: input.username.value,
    })
  }

  /**
   * セッションを無効にする
   * @param session
   */
  static async revokeSession(session: SessionContext) {
    await session.revoke()
  }

  /**
   * セッションを更新する
   * @param session
   * @param input
   */
  static updatePublicData(
    session: SessionContext,
    input: {
      name: Name | null
      username: Username
      iconImageId: Id | null
    }
  ) {
    return session.setPublicData({
      iconImageId: input.iconImageId?.value || null,
      name: input.name?.value || null,
      username: input.username.value,
    })
  }
}
