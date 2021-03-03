import db from "db"
import {
  Biography,
  Email,
  HashedPassword,
  Id,
  Name,
  UserEntity,
  Username,
} from "integrations/domain"
import { UserRepository } from "integrations/domain/repositories"

export class UserRepositoryService implements UserRepository {
  async find(id: Id) {
    const user = await db.user.findUnique({
      where: { id: id.value },
      include: {
        headerImage: {
          select: { id: true, path: true },
        },
        iconImage: {
          select: { id: true, path: true },
        },
      },
    })

    if (user === null) {
      return null
    }

    return new UserEntity({
      email: new Email(user.email),
      biography: new Biography(user.biography),
      headerImageId: user.headerImage ? new Id(user.headerImage.id) : null,
      iconImageId: user.iconImage ? new Id(user.iconImage.id) : null,
      id: new Id(user.id),
      name: user.name ? new Name(user.name) : null,
      username: new Username(user.username),
      hashedPassword: new HashedPassword(user.hashedPassword),
      settingId: null,
    })
  }

  async findByUsername(username: Username) {
    const user = await db.user.findUnique({
      where: { username: username.value },
      include: {
        headerImage: {
          select: { id: true, path: true },
        },
        iconImage: {
          select: { id: true, path: true },
        },
      },
    })

    if (user === null) {
      return null
    }

    return new UserEntity({
      email: new Email(user.email),
      biography: new Biography(user.biography),
      headerImageId: user.headerImage ? new Id(user.headerImage.id) : null,
      iconImageId: user.iconImage ? new Id(user.iconImage.id) : null,
      id: new Id(user.id),
      name: user.name ? new Name(user.name) : null,
      username: new Username(user.username),
      hashedPassword: new HashedPassword(user.hashedPassword),
      settingId: null,
    })
  }

  async findByEmail(email: Email) {
    const user = await db.user.findUnique({
      where: { email: email.value },
      include: {
        headerImage: {
          select: { id: true, path: true },
        },
        iconImage: {
          select: { id: true, path: true },
        },
      },
    })

    if (user === null) {
      return null
    }

    return new UserEntity({
      email: new Email(user.email),
      biography: new Biography(user.biography),
      headerImageId: user.headerImage ? new Id(user.headerImage.id) : null,
      iconImageId: user.iconImage ? new Id(user.iconImage.id) : null,
      id: new Id(user.id),
      name: user.name ? new Name(user.name) : null,
      username: new Username(user.username),
      hashedPassword: new HashedPassword(user.hashedPassword),
      settingId: null,
    })
  }

  async upsert(userEntity: UserEntity) {
    try {
      await db.user.upsert({
        create: {
          biography: userEntity.biography.value,
          email: userEntity.email.value,
          hashedPassword: userEntity.hashedPassword.value,
          id: userEntity.id.value,
          username: userEntity.username.value,
        },
        update: {
          biography: userEntity.biography.value,
          email: userEntity.email.value,
          headerImage: userEntity.headerImageId
            ? { connect: { id: userEntity.headerImageId.value } }
            : undefined,
          iconImage: userEntity.iconImageId
            ? { connect: { id: userEntity.iconImageId.value } }
            : undefined,
          name: userEntity.name?.value || null,
          username: userEntity.username.value,
        },
        where: { email: userEntity.email.value },
      })

      return null
    } catch (error) {
      return new Error(error.message)
    }
  }
}
