import { resolver } from "blitz"
import {
  CreateFileService,
  UpdateUserProfileService,
} from "integrations/application"
import {
  Biography,
  Id,
  ImageFactory,
  Name,
  zBiography,
  zName,
} from "integrations/domain"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const UpdateUserProfile = z.object({
  biography: zBiography,
  headerImage: z.string().nullable(),
  iconImage: z.string().nullable(),
  name: zName,
})

export default resolver.pipe(
  resolver.zod(UpdateUserProfile),
  resolver.authorize(),
  (input, ctx) => ({
    biography: new Biography(input.biography),
    headerImage: ImageFactory.fromDataURL(input.headerImage),
    iconImage: ImageFactory.fromDataURL(input.iconImage),
    name: new Name(input.name),
    userId: new Id(ctx.session.userId),
  }),
  async (input, ctx) => {
    const app = await createAppContext()

    const headerImageFileEntry = await app
      .get(CreateFileService)
      .call({ userId: input.userId, image: input.headerImage })

    const iconImageFileEntity = await app
      .get(CreateFileService)
      .call({ userId: input.userId, image: input.iconImage })

    await app.get(UpdateUserProfileService).call({
      headerImageId: headerImageFileEntry?.id,
      iconImageId: iconImageFileEntity?.id,
      biography: input.biography,
      name: input.name,
      userId: input.userId,
      session: ctx.session,
    })

    return null
  }
)
