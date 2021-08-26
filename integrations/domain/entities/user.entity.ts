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
  readonly biography!: Biography

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
