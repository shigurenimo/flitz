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
    }
  ) {
    return session.create({
      name: input.name?.value || "",
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
}
