import db from "db"
import {
  Biography,
  Email,
  HashedPassword,
  Id,
  Name,
  Username,
  UserRole,
} from "domain/valueObjects"

/**
 * ## ユーザー
 */
export class UserRepository {
  /**
   * 新しいユーザーを作成する
   * @param input
   * @returns
   */
  static createUser(input: {
    biography: Biography
    email: Email
    hashedPassword: HashedPassword
    name: Name
    role: UserRole
  }) {
    return db.user.create({
      data: {
        account: {
          create: {
            email: input.email.value,
            hashedPassword: input.hashedPassword.value,
            role: input.role.value,
          },
        },
        biography: input.biography.value,
        name: input.name.value,
      },
    })

    // return UserEntity.fromData(user)
  }

  /**
   * ユーザーを取得する
   * @param input
   * @returns
   */
  static getUser(input: { userId: Id }) {
    return db.user.findFirst({
      where: { id: input.userId.value },
    })
  }

  /**
   * ユーザーネームからユーザーを探す
   * @param input
   * @returns
   */
  static getUserByUsername(input: { userId: Id | null; username: Username }) {
    return db.user.findUnique({
      include: {
        followers: input.userId
          ? { where: { followerId: input.userId.value } }
          : false,
      },
      where: { username: input.username.value },
    })
  }

  /**
   * ユーザーをフォローする
   * @param input
   * @returns
   */
  static async followUser(input: { followerId: Id; followeeId: Id }) {
    const [user] = await db.$transaction([
      db.user.update({
        data: {
          followers: {
            create: {
              follower: { connect: { id: input.followerId.value } },
            },
          },
          followersCount: { increment: 1 },
        },
        include: {
          followers: { where: { followerId: input.followerId.value } },
        },
        where: { id: input.followeeId.value },
      }),
      db.user.update({
        data: { followeesCount: { increment: 1 } },
        where: { id: input.followerId.value },
      }),
    ])

    return user
  }

  /**
   * ユーザーのフォローを外す
   * @param input
   * @returns
   */
  static async unfollowUser(input: { followerId: Id; followeeId: Id }) {
    const [user] = await db.$transaction([
      db.user.update({
        data: {
          followers: {
            delete: {
              followerId_followeeId: {
                followerId: input.followerId.value,
                followeeId: input.followeeId.value,
              },
            },
          },
          followersCount: { decrement: 1 },
        },
        include: {
          followers: { where: { followerId: input.followerId.value } },
        },
        where: { id: input.followeeId.value },
      }),
      db.user.update({
        data: {
          followeesCount: { decrement: 1 },
        },
        where: { id: input.followerId.value },
      }),
    ])

    return user
  }
}
