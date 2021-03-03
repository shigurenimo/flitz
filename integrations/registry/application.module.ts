import { Module } from "@nestjs/common"
import * as module from "integrations/application"
import { DomainModule } from "integrations/registry/domain.module"
import { InfrastractureModule } from "integrations/registry/infrastructure.module"

@Module({
  imports: [DomainModule, InfrastractureModule],
  providers: Object.values(module),
  exports: [...Object.values(module), DomainModule, InfrastractureModule],
})
export class AppModule {}
