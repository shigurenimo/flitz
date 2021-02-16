import { UploadFileService } from "app/services"
import { resolver } from "blitz"
import {
  Biography,
  biographySchema,
  Id,
  ImageFactory,
  Name,
  nameSchema,
} from "integrations/domain"
import {
  EnvRepository,
  FileRepository,
  ImageRepository,
  SessionRepository,
  StorageRepository,
  UserRepository,
} from "integrations/infrastructure"
import * as z from "zod"

const UpdateUserProfile = z.object({
  biography: biographySchema,
  headerImage: z.string().nullable(),
  iconImage: z.string().nullable(),
  name: nameSchema,
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
  async ({ biography, headerImage, iconImage, name, userId }, ctx) => {
    const fileService = new UploadFileService(
      new EnvRepository(),
      new FileRepository(),
      new ImageRepository(),
      new StorageRepository()
    )

    const { fileEntity: headerImageFileEntry } = await fileService.execute({
      userId,
      image: headerImage,
    })

    const { fileEntity: iconImageFileEntity } = await fileService.execute({
      userId,
      image: iconImage,
    })

    const userRepository = new UserRepository()

    const { user, userEntity } = await userRepository.update({
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
)
