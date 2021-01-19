import { Id } from "domain/valueObjects/id"
import { Name } from "domain/valueObjects/name"
import { Username } from "domain/valueObjects/username"
import { UserRole } from "domain/valueObjects/userRole"
import { SessionContext } from "blitz"

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
