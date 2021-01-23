import { Ctx } from "blitz"
import { ImageFactory } from "domain/factories"
import {
  Biography,
  biographySchema,
  Id,
  Name,
  nameSchema,
  Username,
} from "domain/valueObjects"
import { SessionRepository, UserRepository } from "infrastructure"
import { FileService } from "services"
import * as z from "zod"

const inputSchema = z.object({
  biography: biographySchema,
  headerImage: z.string().nullable(),
  iconImage: z.string().nullable(),
  name: nameSchema,
})

const updateUserProfile = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  ctx.session.authorize()

  const { biography, headerImage, iconImage, name } = inputSchema
    .transform((input) => ({
      biography: new Biography(input.biography),
      headerImage: ImageFactory.fromDataURL(input.headerImage),
      iconImage: ImageFactory.fromDataURL(input.iconImage),
      name: new Name(input.name),
    }))
    .parse(input)

  const userId = new Id(ctx.session.userId)

  const headerImageFile = await FileService.uploadFile({
    userId,
    image: headerImage,
  })

  const iconImageFile = await FileService.uploadFile({
    userId,
    image: iconImage,
  })

  const user = await UserRepository.updateUser({
    biography,
    headerImageId: headerImageFile ? new Id(headerImageFile.id) : null,
    iconImageId: iconImageFile ? new Id(iconImageFile.id) : null,
    id: userId,
    name,
  })

  await SessionRepository.updatePublicData(ctx.session, {
    name: Name.nullable(user.name),
    username: new Username(user.username),
    iconImageId: user.iconImage ? new Id(user.iconImage.id) : null,
  })

  return user
}

export default updateUserProfile
