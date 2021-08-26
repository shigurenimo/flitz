import { Module } from "@nestjs/common"
import * as servicesModule from "integrations/application"
import * as domainRepositoriesModule from "integrations/domain/repositories"
import * as adaptersModule from "integrations/infrastructure/adapters"
import * as convertersModule from "integrations/infrastructure/converters"
import * as queriesModule from "integrations/infrastructure/views"
import * as repositoriesModule from "integrations/infrastructure/repositories"
import * as domainModule from "integrations/domain/services"

@Module({
  providers: [
    ...Object.values(servicesModule),
    ...Object.values(domainModule),
    ...Object.values(adaptersModule),
    ...Object.values(queriesModule),
    ...Object.values(convertersModule),
    {
      provide: domainRepositoriesModule.FileRepository,
      useClass: repositoriesModule.FileRepository,
    },
    {
      provide: domainRepositoriesModule.FriendshipRepository,
      useClass: repositoriesModule.FriendshipRepository,
    },
    {
      provide: domainRepositoriesModule.LikeRepository,
      useClass: repositoriesModule.LikeRepository,
    },
    {
      provide: domainRepositoriesModule.MessageRepository,
      useClass: repositoriesModule.MessageRepository,
    },
    {
      provide: domainRepositoriesModule.NotificationRepository,
      useClass: repositoriesModule.NotificationRepository,
    },
    {
      provide: domainRepositoriesModule.PostRepository,
      useClass: repositoriesModule.PostRepository,
    },
    {
      provide: domainRepositoriesModule.ReferenceRepository,
      useClass: repositoriesModule.ReferenceRepository,
    },
    {
      provide: domainRepositoriesModule.SettingRepository,
      useClass: repositoriesModule.SettingRepository,
    },
    {
      provide: domainRepositoriesModule.UserRepository,
      useClass: repositoriesModule.UserRepository,
    },
  ],
  exports: [...Object.values(servicesModule), ...Object.values(queriesModule)],
})
export class AppModule {}
