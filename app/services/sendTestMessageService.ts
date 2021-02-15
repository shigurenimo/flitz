import admin from "firebase-admin"
import { Id } from "integrations/domain"
import {
  FirebaseRepository,
  SettingRepository,
} from "integrations/infrastructure"

export class SendTestMessageService {
  constructor(
    private firebaseRepository: FirebaseRepository,
    private settingRepository: SettingRepository
  ) {}

  async execute(input: { userId: Id }) {
    this.firebaseRepository.initialize()

    const { settingEntity } = await this.settingRepository.getSetting({
      userId: input.userId,
    })

    if (settingEntity === null || settingEntity.fcmToken === null) {
      throw new Error("")
    }

    return admin.messaging().sendToDevice(settingEntity.fcmToken, {
      notification: {
        title: "TEST Notification",
        body: "This is a test Notification.",
      },
    })
  }
}
