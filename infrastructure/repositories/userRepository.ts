import db from "db"
import { IUserRepository } from "domain/repositories"
import {
  Biography,
  Email,
  HashedPassword,
  Id,
  Name,
  Username,
  UserRole,
} from "domain/valueObjects"
import { PrismaAdapter } from "infrastructure/adapters"

export class UserRepository implements IUserRepository {
  async createUser(input: {
    biography: Biography
    email: Email
    hashedPassword: HashedPassword
    name: Name
    role: UserRole
  }) {
    const user = await db.user.create({
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

    const userEntity = new PrismaAdapter().toUserEntity(user)

    return { user, userEntity }
  }

  async getUser(input: { userId: Id }) {
    const user = await db.user.findFirst({
      where: { id: input.userId.value },
    })

    const userEntity = new PrismaAdapter().toUserEntity(user)

    return { user, userEntity }
  }

  async getUserByUsername(input: { userId: Id | null; username: Username }) {
    const user = await db.user.findUnique({
      include: {
        followers: input.userId
          ? { where: { followerId: input.userId.value } }
          : false,
        headerImage: true,
        iconImage: true,
      },
      where: { username: input.username.value },
    })

    const userEntity = new PrismaAdapter().toUserEntity(user)

    return { user, userEntity }
  }

  async followUser(input: { followerId: Id; followeeId: Id }) {
    const [user] = await db.$transaction([
      db.user.update({
        data: {
          followers: {
            create: { follower: { connect: { id: input.followerId.value } } },
          },
          followersCount: { increment: 1 },
        },
        include: {
          followers: { where: { followerId: input.followerId.value } },
          iconImage: true,
          headerImage: true,
        },
        where: { id: input.followeeId.value },
      }),
      db.user.update({
        data: { followeesCount: { increment: 1 } },
        where: { id: input.followerId.value },
      }),
    ])

    const userEntity = new PrismaAdapter().toUserEntity(user)

    return { user, userEntity }
  }

  async unfollowUser(input: { followerId: Id; followeeId: Id }) {
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
          iconImage: true,
          headerImage: true,
        },
        where: { id: input.followeeId.value },
      }),
      db.user.update({
        data: { followeesCount: { decrement: 1 } },
        where: { id: input.followerId.value },
      }),
    ])

    const userEntity = new PrismaAdapter().toUserEntity(user)

    return { user, userEntity }
  }

  async updateUser(input: {
    id: Id
    biography: Id
    headerImageId: Id | null
    iconImageId: Id | null
    name: Name
  }) {
    const user = await db.user.update({
      data: {
        name: input.name.value,
        biography: input.biography.value,
        headerImage: input.headerImageId
          ? { connect: { id: input.headerImageId.value } }
          : undefined,
        iconImage: input.iconImageId
          ? { connect: { id: input.iconImageId.value } }
          : undefined,
      },
      where: { id: input.id.value },
      include: { iconImage: true },
    })

    const userEntity = new PrismaAdapter().toUserEntity(user)

    return { user, userEntity }
  }

  async updateUsername(input: { id: Id; username: Name }) {
    const user = await db.user.update({
      data: {
        username: input.username.value,
      },
      where: { id: input.id.value },
      include: { iconImage: true },
    })

    const userEntity = new PrismaAdapter().toUserEntity(user)

    return { user, userEntity }
  }
}