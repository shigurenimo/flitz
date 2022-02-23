import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import {
  CreateFileService,
  UpdateUserProfileService,
} from "integrations/application"
import { Id, Name, ShortText } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({
  name: z.string(),
  biography: z.string(),
  headerFileId: z.string().nullable(),
  iconFileId: z.string().nullable(),
})

const updateUserProfile = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      name: new Name(props.name),
      biography: new ShortText(props.biography),
      headerFileId: props.headerFileId ? new Id(props.headerFileId) : null,
      iconFileId: props.iconFileId ? new Id(props.iconFileId) : null,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props, ctx) => {
    const createFileService = container.resolve(CreateFileService)

    if (props.headerFileId !== null) {
      const headerImageFile = await createFileService.execute({
        userId: props.userId,
        fileId: props.headerFileId,
      })
      if (headerImageFile instanceof Error) {
        throw headerImageFile
      }
    }

    if (props.iconFileId !== null) {
      const iconImageFile = await createFileService.execute({
        userId: props.userId,
        fileId: props.iconFileId,
      })

      if (iconImageFile instanceof Error) {
        throw iconImageFile
      }
    }

    const updateUserProfileService = container.resolve(UpdateUserProfileService)

    const newUser = await updateUserProfileService.execute({
      headerImageId: props.headerFileId,
      iconImageId: props.iconFileId,
      biography: props.biography,
      name: props.name,
      userId: props.userId,
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

export default withSentry(updateUserProfile, "updateUserProfile")
