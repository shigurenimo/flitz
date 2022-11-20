import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { Id, Name, ShortText } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { CreateFileService, UpdateUserProfileService } from "service"

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

    const service = container.resolve(UpdateUserProfileService)

    const user = await service.execute({
      headerImageId: props.headerFileId,
      iconImageId: props.iconFileId,
      biography: props.biography,
      name: props.name,
      userId: props.userId,
    })

    if (user instanceof Error) {
      throw user
    }

    await ctx.session.$setPublicData({
      name: user.name?.value ?? null,
      username: user.username.value,
      iconImageId: user.iconImageId?.value ?? null,
    })

    return null
  }
)

export default withSentry(updateUserProfile, "updateUserProfile")
