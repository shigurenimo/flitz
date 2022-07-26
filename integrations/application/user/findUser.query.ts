import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { PrismaProfile } from "integrations/infrastructure/types"
import { AppUserProfile } from "integrations/types"

type Props = {
  userId: Id
}

@injectable()
export class FindUserQuery {
  /**
   * ユーザを取得する
   * @param props
   */
  async execute(props: Props) {
    try {
      const prismaUser = await db.user.findUnique({
        where: { id: props.userId.value },
        include: {
          followers: props
            ? { where: { followerId: props.userId.value } }
            : false,
          headerImage: true,
          iconImage: true,
        },
      })

      if (prismaUser === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      return this.toAppUserProfile(prismaUser)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }

  toAppUserProfile(prismaUser: PrismaProfile): AppUserProfile {
    return {
      id: prismaUser.id,
      createdAt: prismaUser.createdAt,
      username: prismaUser.username,
      name: prismaUser.name || null,
      biography: prismaUser.biography,
      iconImageId: prismaUser.iconImage?.id || null,
      headerImageId: prismaUser.headerImage?.id || null,
      siteURL: prismaUser.siteURL,
      isFollowee: (prismaUser.followers || []).length > 0,
      followeesCount: prismaUser.followeesCount,
      followersCount: prismaUser.followersCount,
    }
  }
}
