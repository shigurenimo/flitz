import type { UserEntity } from "integrations/domain/entities"
import type { Email, Id } from "integrations/domain/valueObjects"

export class SettingEntity {
  discoverableByEmail!: boolean
  fcmToken!: string | null
  fcmTokenForMobile!: string | null
  id!: Id
  notificationEmail!: Email | null
  protected!: boolean
  subscribeMessage!: boolean
  subscribePostLike!: boolean
  subscribePostQuotation!: boolean
  user!: UserEntity | null
  userId!: Id | null

  constructor(public props: Omit<SettingEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
