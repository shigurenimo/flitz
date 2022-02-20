import { Email, Id } from "integrations/domain/valueObjects"
import { z } from "zod"

const zProps = z.object({
  id: z.instanceof(Id),
  discoverableByEmail: z.boolean(),
  fcmToken: z.string().nullable(),
  fcmTokenForMobile: z.string().nullable(),
  notificationEmail: z.instanceof(Email).nullable(),
  protected: z.boolean(),
  subscribeMessage: z.boolean(),
  subscribePostLike: z.boolean(),
  subscribePostQuotation: z.boolean(),
  userId: z.instanceof(Id),
})

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

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }

  updateFcmToken(fcmToken: string | null, fcmTokenForMobile: string | null) {
    return new SettingEntity({
      ...this.props,
      fcmToken,
      fcmTokenForMobile,
    })
  }
}
