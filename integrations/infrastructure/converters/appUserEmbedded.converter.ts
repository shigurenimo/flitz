import { injectable } from "tsyringe"
import { PrismaUserEmbedded } from "integrations/infrastructure/types"
import { AppUserEmbedded } from "integrations/interface/types"

@injectable()
export class AppUserEmbeddedConverter {
  fromPrisma(user: PrismaUserEmbedded): AppUserEmbedded {
    return {
      id: user.id,
      biography: user.biography,
      iconImageId: user.iconImage?.id ?? null,
      name: user.name,
      username: user.username,
    }
  }
}
