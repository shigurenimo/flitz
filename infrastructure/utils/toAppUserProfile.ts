import { PrismaProfile } from "infrastructure/types"
import { AppUserProfile } from "integrations/types"

export const toAppUserProfile = (data: PrismaProfile): AppUserProfile => {
  return {
    id: data.id,
    createdAt: data.createdAt,
    username: data.username,
    name: data.name || null,
    biography: data.biography,
    iconImageId: data.iconImage?.id || null,
    headerImageId: data.headerImage?.id || null,
    siteURL: data.siteURL,
    isFollowee: 0 < (data.followers || []).length,
    followeesCount: data.followeesCount,
    followersCount: data.followersCount,
  }
}
