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
  settingId: z.instanceof(Id).nullable(),
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
   * 設定データのID
   */
  readonly settingId!: Id | null

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
}
