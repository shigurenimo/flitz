import { AppUserEmbedded } from "infrastructure/models"
import { PrismaUserEmbedded } from "infrastructure/types"

export const toAppUserEmbedded = (
  user: PrismaUserEmbedded
): AppUserEmbedded => {
  return {
    id: user.id,
    biography: user.biography,
    iconImageId: user.iconImage?.id ?? null,
    name: user.name,
    username: user.username,
  }
}
