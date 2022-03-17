import {
  Email,
  HashedPassword,
  Id,
  Name,
  ShortText,
  Username,
} from "integrations/domain/valueObjects"
import { z } from "zod"

const zProps = z.object({
  id: z.instanceof(Id),
  email: z.instanceof(Email),
  username: z.instanceof(Username),
  name: z.instanceof(Name).nullable(),
  biography: z.instanceof(ShortText),
  headerImageId: z.instanceof(Id).nullable(),
  iconImageId: z.instanceof(Id).nullable(),
  hashedPassword: z.instanceof(HashedPassword),
  fcmToken: z.string().nullable(),
  fcmTokenForMobile: z.string().nullable(),
  isProtected: z.boolean(),
  isPublicEmail: z.boolean(),
  isEnabledNotificationEmail: z.boolean(),
  isEnabledNotificationMessage: z.boolean(),
  isEnabledNotificationPostLike: z.boolean(),
  isEnabledNotificationPostQuotation: z.boolean(),
})

/**
 * ユーザー
 */
export class UserEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * メールアドレス（非公開）
   */
  readonly email!: Email

  /**
   * ユーザーID
   */
  readonly username!: Username

  /**
   * 表示名
   */
  readonly name!: Name | null

  /**
   * 自己紹介
   */
  readonly biography!: ShortText

  /**
   * ヘッダー画像
   */
  readonly headerImageId!: Id | null

  /**
   * アイコン画像
   */
  readonly iconImageId!: Id | null

  /**
   * パスワードハッシュ
   */
  readonly hashedPassword!: HashedPassword

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
  readonly isPublicEmail!: boolean

  /**
   * 未定義
   */
  readonly isEnabledNotificationEmail!: boolean

  /**
   * 未定義
   */
  readonly isProtected!: boolean

  /**
   * 未定義
   */
  readonly isEnabledNotificationMessage!: boolean

  /**
   * 未定義
   */
  readonly isEnabledNotificationPostLike!: boolean

  /**
   * 未定義
   */
  readonly isEnabledNotificationPostQuotation!: boolean

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }

  updateHashedPassword(hashedPassword: HashedPassword) {
    return new UserEntity({ ...this.props, hashedPassword })
  }

  updateEmail(email: Email) {
    return new UserEntity({ ...this.props, email })
  }

  updateUsername(username: Username) {
    return new UserEntity({ ...this.props, username })
  }

  updateHeaderImage(headerImageId: Id | null) {
    return new UserEntity({
      ...this.props,
      headerImageId: headerImageId ?? this.headerImageId,
    })
  }

  updateIconImage(iconImageId: Id | null) {
    return new UserEntity({
      ...this.props,
      iconImageId: iconImageId ?? this.iconImageId,
    })
  }

  updateName(name: Name) {
    return new UserEntity({ ...this.props, name })
  }

  updateBiography(biography: ShortText) {
    return new UserEntity({ ...this.props, biography })
  }

  updateFcmToken(fcmToken: string | null, fcmTokenForMobile: string | null) {
    return new UserEntity({ ...this.props, fcmToken, fcmTokenForMobile })
  }
}
