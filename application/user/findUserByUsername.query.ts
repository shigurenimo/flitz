import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id, Username } from "core"
import db from "db"
import { PrismaProfile } from "infrastructure/types"
import { InternalError } from "integrations/errors"
import { AppUserProfile } from "integrations/types"

type Props = {
  username: Username
  loginId: Id | null
}

@injectable()
export class FindUserByUsernameQuery {
  /**
   * ユーザ名からユーザを取得する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const prismaUser = await db.user.findUnique({
        where: { username: props.username.value },
        include: {
          followers: props.loginId
            ? { where: { followerId: props.loginId.value } }
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
      isFollowee: 0 < (prismaUser.followers || []).length,
      followeesCount: prismaUser.followeesCount,
      followersCount: prismaUser.followersCount,
    }
  }
}
