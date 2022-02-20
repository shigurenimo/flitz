import { resolver } from "blitz"
import {
  CreateFileService,
  UpdateUserProfileService,
} from "integrations/application"
import { Id, ImageFactory, Name, ShortText } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({
  biography: z.string(),
  headerImage: z.string().nullable(),
  iconImage: z.string().nullable(),
  name: z.string(),
})

const updateUserProfile = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      biography: new ShortText(props.biography),
      headerImage: ImageFactory.fromDataURL(props.headerImage),
      iconImage: ImageFactory.fromDataURL(props.iconImage),
      name: new Name(props.name),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props, ctx) => {
    const createFileService = container.resolve(CreateFileService)

    const headerImageFile = await createFileService.execute({
      userId: props.userId,
      image: props.headerImage,
    })

    const iconImageFile = await createFileService.execute({
      userId: props.userId,
      image: props.iconImage,
    })

    if (headerImageFile instanceof Error) {
      throw headerImageFile
    }

    if (iconImageFile instanceof Error) {
      throw iconImageFile
    }

    const updateUserProfileService = container.resolve(UpdateUserProfileService)

    const newUser = await updateUserProfileService.execute({
      headerImageId: headerImageFile?.id,
      iconImageId: iconImageFile?.id,
      biography: props.biography,
      name: props.name,
      userId: props.userId,
      session: ctx.session,
    })

    if (newUser instanceof Error) {
      throw newUser
    }

    await ctx.session.$setPublicData({
      name: newUser.name?.value ?? null,
      username: newUser.username.value,
      iconImageId: newUser.iconImageId?.value ?? null,
    })

    return null
  }
)

export default updateUserProfile
