import { Id } from "domain/valueObjects"
import admin from "firebase-admin"
import {
  FirebaseRepository,
  SettingRepository,
} from "infrastructure/repositories"

export class MessagingService {
  firebaseRepository: FirebaseRepository

  settingRepository: SettingRepository

  constructor() {
    this.firebaseRepository = new FirebaseRepository()
    this.settingRepository = new SettingRepository()
  }

  async sendTestMesasge(input: { userId: Id }) {
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
