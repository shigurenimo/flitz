import { Ctx } from "blitz"
import { ImageFactory } from "domain/factories"
import {
  Biography,
  biographySchema,
  Id,
  Name,
  nameSchema,
} from "domain/valueObjects"
import { SessionRepository, UserRepository } from "infrastructure/repositories"
import { FileService } from "app/services"
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

  const fileService = new FileService()

  const { fileEntity: headerImageFileEntry } = await fileService.uploadFile({
    userId,
    image: headerImage,
  })

  const { fileEntity: iconImageFileEntity } = await fileService.uploadFile({
    userId,
    image: iconImage,
  })

  const userRepository = new UserRepository()

  const { user, userEntity } = await userRepository.updateUser({
    biography,
    headerImageId: headerImageFileEntry ? headerImageFileEntry.id : null,
    iconImageId: iconImageFileEntity ? iconImageFileEntity.id : null,
    id: userId,
    name,
  })

  const sessionRepository = new SessionRepository()

  await sessionRepository.updatePublicData(ctx.session, {
    name: userEntity.name,
    username: userEntity.username,
    iconImageId: userEntity.iconImage?.id || null,
  })

  return user
}

export default updateUserProfile
