import { Module } from "@nestjs/common"
import * as domainRepositoriesModule from "integrations/domain/repositories"
import * as adaptersModule from "integrations/infrastructure/adapters"
import * as convertersModule from "integrations/infrastructure/converters"
import * as queriesModule from "integrations/infrastructure/queries"
import * as repositoriesModule from "integrations/infrastructure/repositories"

@Module({
  providers: [
    ...Object.values(adaptersModule),
    ...Object.values(queriesModule),
    ...Object.values(convertersModule),
    {
      provide: domainRepositoriesModule.FileRepository,
      useClass: repositoriesModule.FileRepositoryService,
    },
    {
      provide: domainRepositoriesModule.FriendshipRepository,
      useClass: repositoriesModule.FriendshipRepositoryService,
    },
    {
      provide: domainRepositoriesModule.LikeRepository,
      useClass: repositoriesModule.LikeRepositoryService,
    },
    {
      provide: domainRepositoriesModule.MessageRepository,
      useClass: repositoriesModule.MessageRepositoryService,
    },
    {
      provide: domainRepositoriesModule.NotificationRepository,
      useClass: repositoriesModule.NotificationRepositoryService,
    },
    {
      provide: domainRepositoriesModule.PostRepository,
      useClass: repositoriesModule.PostRepositoryService,
    },
    {
      provide: domainRepositoriesModule.ReferenceRepository,
      useClass: repositoriesModule.ReferenceRepositoryService,
    },
    {
      provide: domainRepositoriesModule.SettingRepository,
      useClass: repositoriesModule.SettingRepositoryService,
    },
    {
      provide: domainRepositoriesModule.UserRepository,
      useClass: repositoriesModule.UserRepositoryService,
    },
  ],
  exports: [
    ...Object.values(domainRepositoriesModule),
    ...Object.values(adaptersModule),
    ...Object.values(queriesModule),
    ...Object.values(convertersModule),
  ],
})
export class InfrastractureModule {}
