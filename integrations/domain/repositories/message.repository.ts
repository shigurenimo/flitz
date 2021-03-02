import { Id } from "integrations/domain"
import { MessageEntity } from "integrations/domain/entities"

/**
 * メッセージ
 */
export abstract class MessageRepository {
  /**
   * 相手のメッセージを既読にする
   * @param input
   */
  abstract markAsRead(userId: Id, relatedUserId: Id): Promise<null>

  /**
   * TODO: 集約
   * @param input
   */
  abstract upsert(messageEntity: MessageEntity): Promise<null>
}
