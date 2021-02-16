import type { Id, PostText } from "integrations/domain/valueObjects"

/**
 * メッセージ
 */
export interface IMessageRepository {
  /**
   * @param input
   */
  markMesagesAsRead(input: { relatedUserId: Id; userId: Id }): Promise<null>

  /**
   * TODO: 集約
   * @param input
   */
  createMessage(input: {
    text: PostText
    userId: Id
    relatedUserId: Id
  }): Promise<null>
}
