import { PrismaUserEmbedded } from "infrastructure/types"
import { AppUserEmbedded } from "integrations/types"

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
