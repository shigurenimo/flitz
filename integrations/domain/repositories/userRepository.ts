import { File, Friendship, User } from "db"
import { UserEntity } from "integrations/domain/entities"
import { UserWithIcon } from "integrations/domain/repositories/types"
import type {
  Biography,
  Email,
  HashedPassword,
  Id,
  Name,
  UserRole,
} from "integrations/domain/valueObjects"

/**
 * ユーザー・リポジトリ
 */
export interface IUserRepository {
  /**
   * 新しいユーザーを作成する
   * TODO: 集約
   * @param input
   * @returns
   */
  createUser(input: {
    biography: Biography
    email: Email
    hashedPassword: HashedPassword
    name: Name
    role: UserRole
  }): Promise<{
    user: User
    userEntity: UserEntity
  }>

  /**
   * ユーザーをフォローする
   * TODO: Move to UserFriendshipRepository
   * @deprecated
   * @param input
   * @returns
   */
  followUser(input: {
    followerId: Id
    followeeId: Id
  }): Promise<{
    user: User & {
      followers: Friendship[]
      iconImage: File | null
      headerImage: File | null
    }
    userEntity: UserEntity
  }>

  /**
   * ユーザーのフォローを外す
   * TODO: Move to UserFriendshipRepository
   * @param input
   * @returns
   */
  unfollowUser(input: {
    followerId: Id
    followeeId: Id
  }): Promise<{
    user: User & {
      followers: Friendship[]
      headerImage: File | null
      iconImage: File | null
    }
    userEntity: UserEntity
  }>

  /**
   * ユーザーを更新する
   * TODO: 集約
   * @param input
   */
  update(input: {
    id: Id
    biography: Id
    headerImageId: Id | null
    iconImageId: Id | null
    name: Name
  }): Promise<{
    user: UserWithIcon
    userEntity: UserEntity
  }>

  /**
   * ユーザーネームを更新する
   * TODO: 統合する
   * @deprecated
   * @param input
   */
  updateUsername(input: {
    id: Id
    username: Name
  }): Promise<{
    user: UserWithIcon
    userEntity: UserEntity
  }>
}
