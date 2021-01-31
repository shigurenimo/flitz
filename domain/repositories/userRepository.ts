import { File, Friendship, User } from "db"
import { UserEntity } from "domain/entities"
import { UserWithIcon } from "domain/repositories/types"
import type {
  Biography,
  Email,
  HashedPassword,
  Id,
  Name,
  Username,
  UserRole,
} from "domain/valueObjects"

export interface IUserRepository {
  /**
   * 新しいユーザーを作成する
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
   * ユーザーを取得する
   * @param input
   * @returns
   */
  getUser(input: {
    userId: Id
  }): Promise<{
    user: User | null
    userEntity: UserEntity | null
  }>

  /**
   * ユーザーネームからユーザーを探す
   * @param input
   * @returns
   */
  getUserByUsername(input: {
    userId: Id | null
    username: Username
  }): Promise<{
    user:
      | (User & {
          followers: Friendship[]
          headerImage: File | null
          iconImage: File | null
        })
      | null
    userEntity: UserEntity | null
  }>

  /**
   * ユーザーをフォローする
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

  updateUser(input: {
    id: Id
    biography: Id
    headerImageId: Id | null
    iconImageId: Id | null
    name: Name
  }): Promise<{
    user: UserWithIcon
    userEntity: UserEntity
  }>

  updateUsername(input: {
    id: Id
    username: Name
  }): Promise<{
    user: UserWithIcon
    userEntity: UserEntity
  }>
}
