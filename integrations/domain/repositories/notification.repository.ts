import { NotificationEntity } from "integrations/domain/entities"
import { Id } from "integrations/domain/valueObjects"

/**
 * 通知
 */
export abstract class NotificationRepository {
  /**
   * @param input
   */
  abstract upsert(notificationEntity: NotificationEntity): Promise<null>

  abstract markAsRead(userId: Id): Promise<null>
}
