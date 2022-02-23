import { captureException, Severity } from "@sentry/node"
import { NotFoundError } from "blitz"
import db from "db"
import {
  Email,
  HashedPassword,
  Id,
  Name,
  ShortText,
  UserEntity,
  Username,
} from "integrations/domain"

export class UserRepository {
  async find(id: Id) {
    try {
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
        biography: new ShortText(user.biography),
        headerImageId: user.headerImage ? new Id(user.headerImage.id) : null,
        iconImageId: user.iconImage ? new Id(user.iconImage.id) : null,
        id: new Id(user.id),
        name: user.name ? new Name(user.name) : null,
        username: new Username(user.username),
        hashedPassword: new HashedPassword(user.hashedPassword),
        settingId: null,
      })
    } catch (error) {
      captureException(error, { level: Severity.Fatal })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }

  async findByUsername(username: Username) {
    try {
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
        biography: new ShortText(user.biography),
        headerImageId: user.headerImage ? new Id(user.headerImage.id) : null,
        iconImageId: user.iconImage ? new Id(user.iconImage.id) : null,
        id: new Id(user.id),
        name: user.name ? new Name(user.name) : null,
        username: new Username(user.username),
        hashedPassword: new HashedPassword(user.hashedPassword),
        settingId: null,
      })
    } catch (error) {
      captureException(error, { level: Severity.Fatal })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }

  async findByEmail(email: Email) {
    try {
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
        return new NotFoundError()
      }

      return new UserEntity({
        email: new Email(user.email),
        biography: new ShortText(user.biography),
        headerImageId: user.headerImage ? new Id(user.headerImage.id) : null,
        iconImageId: user.iconImage ? new Id(user.iconImage.id) : null,
        id: new Id(user.id),
        name: user.name ? new Name(user.name) : null,
        username: new Username(user.username),
        hashedPassword: new HashedPassword(user.hashedPassword),
        settingId: null,
      })
    } catch (error) {
      captureException(error, { level: Severity.Fatal })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }

  async upsert(user: UserEntity) {
    try {
      await db.user.upsert({
        create: {
          biography: user.biography.value,
          email: user.email.value,
          hashedPassword: user.hashedPassword.value,
          id: user.id.value,
          username: user.username.value,
        },
        update: {
          biography: user.biography.value,
          email: user.email.value,
          headerImage: user.headerImageId
            ? { connect: { id: user.headerImageId.value } }
            : undefined,
          iconImage: user.iconImageId
            ? { connect: { id: user.iconImageId.value } }
            : undefined,
          name: user.name?.value || null,
          username: user.username.value,
        },
        where: { email: user.email.value },
      })

      return null
    } catch (error) {
      captureException(error, { level: Severity.Fatal })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
