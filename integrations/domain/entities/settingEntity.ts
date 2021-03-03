import type { Email, Id } from "integrations/domain/valueObjects"

/**
 * 設定
 */
export class SettingEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 未定義
   */
  readonly discoverableByEmail!: boolean

  /**
   * FCMトークン
   *
   * ブラウザ通知を受け取る為に使用します。
   */
  readonly fcmToken!: string | null

  /**
   * FCMトークン（モバイル用）
   */
  readonly fcmTokenForMobile!: string | null

  /**
   * 未定義
   */
  readonly notificationEmail!: Email | null

  /**
   * 未定義
   */
  readonly protected!: boolean

  /**
   * 未定義
   */
  readonly subscribeMessage!: boolean

  /**
   * 未定義
   */
  readonly subscribePostLike!: boolean

  /**
   * 未定義
   */
  readonly subscribePostQuotation!: boolean

  /**
   * ユーザーID
   */
  readonly userId!: Id

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
