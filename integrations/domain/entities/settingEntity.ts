import type { Email, Id } from "integrations/domain/valueObjects"

/**
 * 設定
 */
export class SettingEntity {
  /**
   * ID
   */
  id!: Id

  /**
   * 未定義
   */
  discoverableByEmail!: boolean

  /**
   * FCMトークン
   *
   * ブラウザ通知を受け取る為に使用します。
   */
  fcmToken!: string | null

  /**
   * FCMトークン（モバイル用）
   */
  fcmTokenForMobile!: string | null

  /**
   * 未定義
   */
  notificationEmail!: Email | null

  /**
   * 未定義
   */
  protected!: boolean

  /**
   * 未定義
   */
  subscribeMessage!: boolean

  /**
   * 未定義
   */
  subscribePostLike!: boolean

  /**
   * 未定義
   */
  subscribePostQuotation!: boolean

  /**
   * ユーザーID
   */
  userId!: Id

  constructor(
    public props: {
      id: Id
      discoverableByEmail: boolean
      fcmToken: string | null
      fcmTokenForMobile: string | null
      notificationEmail: Email | null
      protected: boolean
      subscribeMessage: boolean
      subscribePostLike: boolean
      subscribePostQuotation: boolean
      userId: Id
    }
  ) {
    Object.assign(this, props)
    Object.freeze(this)
  }

  update(input: { fcmToken: string | null; fcmTokenForMobile: string | null }) {
    return new SettingEntity({
      ...this.props,
      ...input,
    })
  }
}
