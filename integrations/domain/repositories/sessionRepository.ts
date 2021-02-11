import type { SessionContext } from "blitz"
import type { Id, Name, Username, UserRole } from "integrations/domain/valueObjects"

/**
 * セッション
 */
export interface ISessionRepository {
  /**
   * 新しいセッションを作成する
   * @param session
   * @param input
   * @returns
   */
  createSession(
    session: SessionContext,
    input: {
      name: Name | null
      role: UserRole
      userId: Id
      username: Username
      iconImageId: Id | null
    }
  ): Promise<null>

  /**
   * セッションを無効にする
   * @param session
   */
  revokeSession(session: SessionContext): Promise<null>

  /**
   * セッションを更新する
   * @param session
   * @param input
   */
  updatePublicData(
    session: SessionContext,
    input: {
      name: Name | null
      username: Username
      iconImageId: Id | null
    }
  ): any

  getUserId(session: { userId: string }): Id
}
