import type {
  Biography,
  Email,
  HashedPassword,
  Id,
  Name,
  Username,
} from "integrations/domain/valueObjects"

/**
 * ユーザー
 */
export class UserEntity {
  /**
   * ID
   */
  id!: Id

  /**
   * メールアドレス（非公開）
   */
  email!: Email

  /**
   * ユーザーID
   */
  username!: Username

  /**
   * 表示名
   */
  name!: Name | null

  /**
   * 自己紹介
   */
  biography!: Biography

  /**
   * ヘッダー画像
   */
  headerImageId!: Id | null

  /**
   * アイコン画像
   */
  iconImageId!: Id | null

  /**
   * パスワードハッシュ
   */
  hashedPassword!: HashedPassword

  /**
   * 設定データのID
   */
  settingId!: Id | null

  constructor(
    public props: {
      id: Id
      email: Email
      username: Username
      name: Name | null
      biography: Biography
      headerImageId: Id | null
      iconImageId: Id | null
      hashedPassword: HashedPassword
      settingId: Id | null
    }
  ) {
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

  update(input: {
    headerImageId?: Id
    iconImageId?: Id
    name: Name
    biography: Biography
  }) {
    return new UserEntity({
      ...this.props,
      biography: input.biography ?? this.biography,
      name: input.name ?? this.name,
      headerImageId: input.iconImageId ?? this.headerImageId,
      iconImageId: input.iconImageId ?? this.iconImageId,
    })
  }
}
