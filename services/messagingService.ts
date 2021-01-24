import { Id } from "domain/valueObjects"
import admin from "firebase-admin"
import { FirebaseRepository, SettingRepository } from "infrastructure"

export class MessagingService {
  static async sendTestMesasge(input: { userId: Id }) {
    FirebaseRepository.initialize()

    const setting = await SettingRepository.getSetting({ userId: input.userId })

    if (setting === null || setting.fcmToken === null) {
      throw new Error("")
    }

    return admin.messaging().sendToDevice(setting.fcmToken, {
      notification: {
        title: "TEST Notification",
        body: "This is a test Notification.",
      },
    })
  }
}
