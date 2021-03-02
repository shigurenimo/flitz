import { Injectable } from "@nestjs/common"
import { NotFoundError } from "blitz"
import admin from "firebase-admin"
import { Id, SettingRepository } from "integrations/domain"
import { FirebaseAdapterService } from "integrations/infrastructure"

@Injectable()
export class TestNotificationService {
  constructor(
    private settingRepository: SettingRepository,
    private firebaseAdapterService: FirebaseAdapterService
  ) {}

  async call(input: { userId: Id }) {
    try {
      const settingEntity = await this.settingRepository.findByUserId(
        input.userId
      )

      if (settingEntity === null) {
        throw new NotFoundError()
      }

      if (settingEntity === null || settingEntity.fcmToken === null) {
        throw new Error("")
      }

      this.firebaseAdapterService.initialize()

      // TODO(reiwa): MessagingAdapterに変換する
      await admin.messaging().sendToDevice(settingEntity.fcmToken, {
        notification: {
          title: "TEST Notification",
          body: "This is a test Notification.",
        },
      })

      return null
    } catch (error) {
      return Error()
    }
  }
}
