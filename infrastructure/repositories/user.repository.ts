import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import {
  Email,
  HashedPassword,
  Id,
  Name,
  ShortText,
  UserEntity,
  Username,
} from "core"
import db from "db"

export class UserRepository {
  async find(id: Id) {
    try {
      const prismaUser = await db.user.findUnique({
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

      if (prismaUser === null) {
        return null
      }

      return new UserEntity({
        email: new Email(prismaUser.email),
        biography: new ShortText(prismaUser.biography),
        headerImageId: prismaUser.headerImage
          ? new Id(prismaUser.headerImage.id)
          : null,
        iconImageId: prismaUser.iconImage
          ? new Id(prismaUser.iconImage.id)
          : null,
        id: new Id(prismaUser.id),
        name: prismaUser.name ? new Name(prismaUser.name) : null,
        username: new Username(prismaUser.username),
        hashedPassword: new HashedPassword(prismaUser.hashedPassword),
        fcmToken: prismaUser.fcmToken,
        fcmTokenForMobile: prismaUser.fcmTokenForMobile,
        isPublicEmail: prismaUser.isPublicEmail,
        isEnabledNotificationEmail: prismaUser.isEnabledNotificationEmail,
        isProtected: prismaUser.isProtected,
        isEnabledNotificationMessage: prismaUser.isEnabledNotificationMessage,
        isEnabledNotificationPostLike: prismaUser.isEnabledNotificationPostLike,
        isEnabledNotificationPostQuotation:
          prismaUser.isEnabledNotificationPostQuotation,
      })
    } catch (error) {
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }

  async findByUsername(username: Username) {
    try {
      const prismaUser = await db.user.findUnique({
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

      if (prismaUser === null) {
        return null
      }

      return new UserEntity({
        email: new Email(prismaUser.email),
        biography: new ShortText(prismaUser.biography),
        headerImageId: prismaUser.headerImage
          ? new Id(prismaUser.headerImage.id)
          : null,
        iconImageId: prismaUser.iconImage
          ? new Id(prismaUser.iconImage.id)
          : null,
        id: new Id(prismaUser.id),
        name: prismaUser.name ? new Name(prismaUser.name) : null,
        username: new Username(prismaUser.username),
        hashedPassword: new HashedPassword(prismaUser.hashedPassword),
        fcmToken: prismaUser.fcmToken,
        fcmTokenForMobile: prismaUser.fcmTokenForMobile,
        isPublicEmail: prismaUser.isPublicEmail,
        isEnabledNotificationEmail: prismaUser.isEnabledNotificationEmail,
        isProtected: prismaUser.isProtected,
        isEnabledNotificationMessage: prismaUser.isEnabledNotificationMessage,
        isEnabledNotificationPostLike: prismaUser.isEnabledNotificationPostLike,
        isEnabledNotificationPostQuotation:
          prismaUser.isEnabledNotificationPostQuotation,
      })
    } catch (error) {
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }

  async findByEmail(email: Email) {
    try {
      const prismaUser = await db.user.findUnique({
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

      if (prismaUser === null) {
        return new NotFoundError()
      }

      return new UserEntity({
        email: new Email(prismaUser.email),
        biography: new ShortText(prismaUser.biography),
        headerImageId: prismaUser.headerImage
          ? new Id(prismaUser.headerImage.id)
          : null,
        iconImageId: prismaUser.iconImage
          ? new Id(prismaUser.iconImage.id)
          : null,
        id: new Id(prismaUser.id),
        name: prismaUser.name ? new Name(prismaUser.name) : null,
        username: new Username(prismaUser.username),
        hashedPassword: new HashedPassword(prismaUser.hashedPassword),
        fcmToken: prismaUser.fcmToken,
        fcmTokenForMobile: prismaUser.fcmTokenForMobile,
        isPublicEmail: prismaUser.isPublicEmail,
        isEnabledNotificationEmail: prismaUser.isEnabledNotificationEmail,
        isProtected: prismaUser.isProtected,
        isEnabledNotificationMessage: prismaUser.isEnabledNotificationMessage,
        isEnabledNotificationPostLike: prismaUser.isEnabledNotificationPostLike,
        isEnabledNotificationPostQuotation:
          prismaUser.isEnabledNotificationPostQuotation,
      })
    } catch (error) {
      captureException(error, { level: "fatal" })

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
          fcmToken: user.fcmToken,
          fcmTokenForMobile: user.fcmTokenForMobile,
          isPublicEmail: user.isPublicEmail,
          isEnabledNotificationEmail: user.isEnabledNotificationEmail,
          isProtected: user.isProtected,
          isEnabledNotificationMessage: user.isEnabledNotificationMessage,
          isEnabledNotificationPostLike: user.isEnabledNotificationPostLike,
          isEnabledNotificationPostQuotation:
            user.isEnabledNotificationPostQuotation,
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
          fcmToken: user.fcmToken,
          fcmTokenForMobile: user.fcmTokenForMobile,
          isPublicEmail: user.isPublicEmail,
          isEnabledNotificationEmail: user.isEnabledNotificationEmail,
          isProtected: user.isProtected,
          isEnabledNotificationMessage: user.isEnabledNotificationMessage,
          isEnabledNotificationPostLike: user.isEnabledNotificationPostLike,
          isEnabledNotificationPostQuotation:
            user.isEnabledNotificationPostQuotation,
        },
        where: { email: user.email.value },
      })

      return null
    } catch (error) {
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
