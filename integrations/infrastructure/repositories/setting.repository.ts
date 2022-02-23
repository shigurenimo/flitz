import { captureException, Severity } from "@sentry/node"
import db from "db"
import { Email, Id, SettingEntity } from "integrations/domain"

export class SettingRepository {
  async upsert(setting: SettingEntity) {
    try {
      await db.setting.upsert({
        create: {
          id: setting.id.value,
          fcmToken: setting.fcmToken,
          fcmTokenForMobile: setting.fcmTokenForMobile,
          subscribeMessage: setting.subscribeMessage,
          subscribePostLike: setting.subscribePostLike,
          subscribePostQuotation: setting.subscribePostQuotation,
          userId: setting.userId.value,
        },
        update: {
          id: setting.id.value,
          fcmToken: setting.fcmToken,
          fcmTokenForMobile: setting.fcmTokenForMobile,
          subscribeMessage: setting.subscribeMessage,
          subscribePostLike: setting.subscribePostLike,
          subscribePostQuotation: setting.subscribePostQuotation,
          userId: setting.userId.value,
        },
        where: { userId: setting.userId.value },
      })

      return null
    } catch (error) {
      captureException(error, { level: Severity.Fatal })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }

  async findByUserId(userId: Id) {
    try {
      const setting = await db.setting.findUnique({
        where: { userId: userId.value },
      })

      if (setting === null) {
        return null
      }

      return new SettingEntity({
        discoverableByEmail: setting.discoverableByEmail,
        fcmToken: setting.fcmToken || null,
        fcmTokenForMobile: setting.fcmTokenForMobile || null,
        id: new Id(setting.id),
        notificationEmail: setting.notificationEmail
          ? new Email(setting.notificationEmail)
          : null,
        protected: setting.protected,
        subscribeMessage: setting.subscribeMessage,
        subscribePostLike: setting.subscribePostLike,
        subscribePostQuotation: setting.subscribePostQuotation,
        userId: new Id(setting.userId),
      })
    } catch (error) {
      captureException(error, { level: Severity.Fatal })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
