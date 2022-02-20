import { NotificationType } from "integrations/domain/valueObjects"

export class NotificationTypeFactory {
  static follow() {
    return new NotificationType("FOLLOW")
  }

  static friendship() {
    return new NotificationType("FRIENDSHIP")
  }

  static like() {
    return new NotificationType("LIKE")
  }

  static quotation() {
    return new NotificationType("QUOTATION")
  }

  static reply() {
    return new NotificationType("REPLY")
  }
}
